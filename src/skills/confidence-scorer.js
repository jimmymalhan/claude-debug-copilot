/**
 * Confidence Scoring Skill
 *
 * Combines evidence quality, hallucination detection, and alternative-theory
 * analysis into a single confidence score between 0.0 and 1.0.
 *
 * Scoring formula:
 *   baseScore          = verifierBaseScore (from orchestrator verifier agent)
 *   evidenceBonus      = (validClaims / totalClaims) * EVIDENCE_WEIGHT
 *   hallucinationPen   = riskScore * HALLUCINATION_WEIGHT
 *   contradictionPen   = (unresolvedCount / totalContradictions) * CONTRADICTION_WEIGHT
 *   finalScore         = clamp(baseScore + evidenceBonus - hallucinationPen - contradictionPen, 0, 1)
 */

import { EvidenceVerifier } from './evidence-verifier.js';
import { HallucinationDetector } from './hallucination-detector.js';

const EVIDENCE_WEIGHT = 0.25;
const HALLUCINATION_WEIGHT = 0.35;
const CONTRADICTION_WEIGHT = 0.20;

export class ConfidenceScorer {
  /**
   * @param {object} options
   * @param {EvidenceVerifier}     [options.evidenceVerifier]     - Verifier instance
   * @param {HallucinationDetector} [options.hallucinationDetector] - Detector instance
   * @param {string}               [options.repoRoot]             - Repo root passed to sub-skills
   * @param {object}               [options.schema]               - Schema for hallucination detection
   * @param {Array<string>}        [options.knownAPIs]            - Known APIs for hallucination detection
   */
  constructor(options = {}) {
    this.evidenceVerifier = options.evidenceVerifier || new EvidenceVerifier({ repoRoot: options.repoRoot });
    this.hallucinationDetector = options.hallucinationDetector || new HallucinationDetector({
      repoRoot: options.repoRoot,
      schema: options.schema,
      knownAPIs: options.knownAPIs
    });
  }

  /**
   * Compute a confidence score for a diagnostic report.
   *
   * @param {object} input
   * @param {number}        input.baseScore        - Verifier base score (0.0 - 1.0)
   * @param {Array<string|object>} input.claims   - Evidence claims for verification
   * @param {Array<object>} [input.contradictions] - Array of { description, resolved }
   * @param {object}        [input.schema]         - Optional schema for this scoring call
   * @param {Array<string>} [input.knownAPIs]     - Optional APIs for this scoring call
   * @returns {object} Scoring result
   *   - `confidence`         {number}   Final score 0.0 - 1.0
   *   - `baseScore`          {number}
   *   - `evidenceBonus`      {number}
   *   - `hallucinationPenalty` {number}
   *   - `contradictionPenalty` {number}
   *   - `evidenceReport`     {object}   From EvidenceVerifier
   *   - `hallucinationReport` {object}  From HallucinationDetector
   *   - `breakdown`          {string}   Human-readable formula
   */
  score(input) {
    if (!input || typeof input !== 'object') {
      throw new Error('Input must be a valid object');
    }

    const baseScore = this._clamp(input.baseScore ?? 0.5, 0, 1);
    const claims = input.claims || [];
    const contradictions = input.contradictions || [];

    // Update schema/APIs if provided in input (allows per-call customization)
    if (input.schema) {
      this.hallucinationDetector.schema = input.schema;
    }
    if (input.knownAPIs) {
      this.hallucinationDetector.knownAPIs = input.knownAPIs;
    }

    // Run evidence verification
    const evidenceReport = this.evidenceVerifier.verify(claims);
    const validClaims = claims.length - new Set(evidenceReport.issues.map(i => i.claimIndex)).size;
    const evidenceBonus = claims.length > 0
      ? (validClaims / claims.length) * EVIDENCE_WEIGHT
      : 0;

    // Run hallucination detection
    const hallucinationReport = this.hallucinationDetector.detect(claims);
    const hallucinationPenalty = hallucinationReport.riskScore * HALLUCINATION_WEIGHT;

    // Compute contradiction penalty
    const totalContradictions = contradictions.length;
    const unresolvedCount = contradictions.filter(c => !c.resolved).length;
    const contradictionPenalty = totalContradictions > 0
      ? (unresolvedCount / totalContradictions) * CONTRADICTION_WEIGHT
      : 0;

    // Final score
    const raw = baseScore + evidenceBonus - hallucinationPenalty - contradictionPenalty;
    const confidence = parseFloat(this._clamp(raw, 0, 1).toFixed(2));

    return {
      confidence,
      baseScore,
      evidenceBonus: parseFloat(evidenceBonus.toFixed(4)),
      hallucinationPenalty: parseFloat(hallucinationPenalty.toFixed(4)),
      contradictionPenalty: parseFloat(contradictionPenalty.toFixed(4)),
      evidenceReport,
      hallucinationReport,
      breakdown: `${baseScore} + ${evidenceBonus.toFixed(4)} - ${hallucinationPenalty.toFixed(4)} - ${contradictionPenalty.toFixed(4)} = ${confidence}`
    };
  }

  /**
   * Clamp a number between min and max.
   * @param {number} value
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  _clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
}

export default ConfidenceScorer;
