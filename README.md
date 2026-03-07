# Claude Debug Copilot

Most AI debugging workflows are polished fiction dressed up as confidence. Claude Debug Copilot takes the opposite path - evidence first, explanation second, ego last.

This project turns Claude into a repo-aware debugging copilot that retrieves logs, schema, payload fields, and timestamps, challenges its own first answer, and rejects claims that are not backed by evidence. It is built for engineers who are tired of elegant hallucinations and want a workflow that behaves more like a careful incident review than a clever demo.

Read the full article here: [I Made Claude Prove Its Hallucination](https://newsletter.systemdesignlaws.xyz/p/i-made-claude-prove-its-hallucination)

## Why it matters

In real systems, the expensive mistake is rarely a missing prompt. It is trusting a model that sounds right before it is right.

Claude Debug Copilot follows an industry-standard discipline:
- retrieve concrete evidence before diagnosis
- generate a competing explanation from a different failure family
- block unsupported fields, APIs, and claims
- return a structured answer with root cause, evidence, fix, rollback, tests, and confidence

This shifts the workflow from:

```text
question → answer
````

to:

```text
retrieve → challenge → verify → explain
```

That change is small on paper and brutal in practice. It forces the model to earn trust.

## What it does

* classifies failures such as schema drift, write conflicts, stale reads, bad deploys, and auth failures
* retrieves exact debugging evidence from the repo
* pressures the first diagnosis with a skeptic pass
* rejects unsupported claims through a verifier gate
* protects sensitive files through hooks
* keeps the workflow reproducible, Git-friendly, and engineering-grade

## Repo

```text
.claude/agents/
.claude/hooks/
CLAUDE.md
src/
package.json
package-lock.json
README.md
```

## Run

```bash
npm install
claude
```

## Example

```bash
tail -n 200 logs/app.log | claude -p "Diagnose the failure using retrieved evidence only"
git diff main | claude -p "Detect schema drift or unsafe writes"
claude -p "Produce root cause, evidence, fix, rollback, tests, and confidence"
```

## Public repo only

Commit:

* `.claude/agents/*`
* `.claude/hooks/*`
* `CLAUDE.md`
* `src/*`
* `package.json`
* `package-lock.json`
* `README.md`

Ignore:

* `.env`
* `logs/`
* `incidents/`
* `data/`
* `node_modules/`

## The point

This is not another prompt wrapper. It is a tighter debugging loop for engineers who want fewer vibes, fewer invented facts, and far less confident nonsense.

If a model cannot survive evidence, contradiction, and verification, it does not get to call itself useful.