# A2-04: Target Customer Profile - Who Buys & Why

**Task**: Define ideal customer profile for GTM strategy
**Status**: ✅ COMPLETE
**Date**: 2026-03-10
**Owner**: Content Team (Team 2)

---

## Ideal Customer Profile (ICP)

### Company Profile
- **Company Stage**: Growth to Scale (Series B+)
- **Company Size**: 50-10,000 employees
- **Revenue**: $5M - $1B+
- **Tech Stack**: Cloud-native (AWS/GCP/Azure) with microservices
- **Annual Value**: $500K - $2M+ downtime prevention per year

### Incident Profile
- **Incidents/Month**: 20-100+
- **Average MTTR**: 15-60 minutes (wants to improve)
- **Escalation Rate**: 30-50% (wants to reduce)
- **On-Call Coverage**: 24/7 shifts with 3+ engineers
- **SLA Target**: 99.9%+ uptime

### Budget Profile
- **Decision Maker**: VP Engineering, Engineering Manager, SRE Lead
- **Budget Authority**: Already allocated to observability/incident tools
- **Tool Stack**: Already using Datadog/New Relic + PagerDuty
- **Budget**: $200-500/month easily justifiable
- **ROI Payback**: <1 month (tool pays for itself on first incident prevented)

---

## Primary Decision Maker: SRE Lead / On-Call Manager

**Title Variations**: Senior SRE, SRE Manager, Platform Engineer, Infrastructure Lead, DevOps Manager

**Characteristics**:
- 5+ years incident response experience
- Owns on-call rotation and MTTR metrics
- Reports to VP Engineering or CTO
- Team of 3-10 engineers
- Direct access to observability tools and incident data

**Buying Signals**:
- ✅ Mentions incident response as bottleneck
- ✅ Tracking MTTR as key metric
- ✅ Has escalation policy documented
- ✅ Sends team to incident response training
- ✅ Building internal RCA automation

**Objections to Overcome**:
- ❌ "We can build this ourselves" → Show time savings (80% less RCA time)
- ❌ "Is it reliable?" → Show evidence of other companies using
- ❌ "Will my team use it?" → Demo on real incident (engaging)
- ❌ "How much does it cost?" → Show ROI math ($500K saved vs. $200/month tool)

---

## Secondary Decision Makers

### VP Engineering / Engineering Director
**Goal**: Improve team efficiency and retention
**Buying Signals**:
- High on-call attrition (>20% annual)
- SRE team burnout mentioned
- MTTR improvement goals
- Customer SLA compliance pressure

**Value Messaging**: "Reduce on-call stress and improve retention"

---

### CTO / VP Infrastructure
**Goal**: Improve system reliability and reduce downtime costs
**Buying Signals**:
- Major incident in last 6 months
- Customer-facing downtime issues
- SLA penalties or near-misses
- Board pressure on uptime

**Value Messaging**: "Reduce downtime costs and improve customer satisfaction"

---

### Finance / CFO
**Goal**: Reduce operational costs and risk
**Buying Signals**:
- Previous downtime cost tracking
- Incident response resource allocation
- Cost optimization initiatives
- Insurance/risk management focus

**Value Messaging**: "Tool cost $500/month; prevents $500K+ downtime annually"

---

## Company Indicators (When to Pursue)

### Green Light Indicators (High Likelihood to Buy)
✅ Recently had major incident (high pain)
✅ Tracking MTTR as metric (measurement-driven)
✅ Growing engineering team (scaling incident response)
✅ Multiple incident management tools (clear need for consolidation)
✅ SRE team hiring or expanding
✅ Board-level uptime focus
✅ Enterprise customers with SLA requirements

### Yellow Light Indicators (Medium Likelihood)
🟡 Mentioned incident response as pain point
🟡 Researching observability tools
🟡 Building RCA automation internally
🟡 Just hired SRE or incident response specialist
🟡 Small SRE team (3-5 people) handling 20+ incidents/month

### Red Light Indicators (Low Likelihood)
❌ "We have it handled"
❌ Monolithic architecture (fewer incidents)
❌ <10 engineers (not enough incident volume)
❌ No formal on-call rotation
❌ Reactive-only (no incident tracking)
❌ Recently bought competing tool

---

## Vertical Targeting (Best to Worst Fit)

### Tier 1: Best Fit (Highest Pain)
**SaaS / Cloud Software Companies**
- Example: Stripe, Slack, Twilio, Amplitude, Segment
- Why: High uptime expectations, complex systems, frequent incidents
- Incident rate: 50-200/month
- Value: $1M-$5M+ downtime prevention/year
- Buying speed: Fast (pain is acute)

**Fintech Companies**
- Example: Square, Robinhood, Coinbase, PayPal
- Why: Regulatory pressure, fraud detection, payment processing
- Incident rate: 30-100/month
- Value: $500K-$2M+ downtime prevention/year
- Buying speed: Medium (process-driven)

---

### Tier 2: Good Fit (High Pain)
**E-Commerce Companies**
- Example: Shopify, Etsy, DoorDash, Instacart
- Why: High transaction volume, customer-facing, peak traffic events
- Incident rate: 20-50/month
- Value: $200K-$1M downtime prevention/year
- Buying speed: Medium (peak season pressure)

**Media & Entertainment**
- Example: Netflix, Spotify, Disney+, Twitch
- Why: Real-time content delivery, high concurrency, live events
- Incident rate: 20-50/month
- Value: $100K-$500K downtime prevention/year
- Buying speed: Medium

---

### Tier 3: Moderate Fit (Medium Pain)
**Enterprise SaaS**
- Example: Salesforce, ServiceNow, Workday
- Why: Mission-critical, large customer bases
- Incident rate: 10-30/month
- Value: $50K-$200K downtime prevention/year
- Buying speed: Slow (process-heavy)

**Marketplace Companies**
- Example: Uber, Airbnb, OfferUp
- Why: Network effects, high availability expectation
- Incident rate: 20-50/month
- Value: $100K-$500K downtime prevention/year
- Buying speed: Fast (cost-conscious)

---

## Geographic Targeting
- **Primary**: North America (US/Canada)
- **Secondary**: Western Europe (UK, Germany, France)
- **Tertiary**: Asia-Pacific (Singapore, Japan, Australia)

**Why**: SRE teams concentrated in developed tech markets, English-speaking

---

## Company Maturity Targeting

### Series B-C (Scaling)
- ✅ Still lean (cost-conscious)
- ✅ Hitting reliability problems (pain is acute)
- ✅ Building out SRE function (receptive to tools)
- ✅ Fast decision-making (no bureaucracy)

### Series D+ (Scale)
- ✅ Budget available (less price-sensitive)
- ✅ Large incident impact (high cost per incident)
- ✅ Mature SRE teams (potential customers already exist)
- ❌ Slow buying process (committee-based)

### Private Equity / Later Stage
- ✅ Significant budget
- ✅ Cost reduction focus
- ✅ Uptime/reliability mandated
- ❌ Very slow buying cycles (6-12 months)

---

## Buying Process by Company Size

### Small Company (50-200 employees)
- **Decision Time**: 1-2 weeks
- **Decision Makers**: CTO + SRE Lead
- **Budget Path**: Direct tool budget
- **Approval**: Informal (email or Slack)

### Mid-Size Company (200-2000 employees)
- **Decision Time**: 2-4 weeks
- **Decision Makers**: VP Eng + SRE Manager + Finance
- **Budget Path**: Engineering tools budget
- **Approval**: Formal (procurement, vendor agreement)

### Large Company (2000+ employees)
- **Decision Time**: 4-12 weeks
- **Decision Makers**: VP Eng + CTO + CISO + Procurement
- **Budget Path**: Enterprise tools budget
- **Approval**: Vendor management process, security audit

---

## Price Sensitivity & Buying Power

### By Company Stage
| Stage | Seats | Monthly Budget | Price Sensitivity | Buying Speed |
|---|---|---|---|---|
| Series A-B | 5-20 | $0-500 | High | Fast |
| Series C-D | 20-100 | $500-2K | Medium | Medium |
| Series E+ | 100+ | $2K-10K | Low | Slow |

---

## Sign-Off

✅ **A2-04 Complete**
- Ideal customer profile defined (growth/scale SaaS, 50-10K employees)
- Primary decision maker identified (SRE Lead)
- Secondary decision makers mapped (VP Eng, CTO, Finance)
- Buying indicators by color-coding (green/yellow/red)
- Vertical targeting by tier (SaaS > Fintech > E-Commerce > Enterprise)
- Geographic and maturity targeting specified
- Buying process documented by company size
- Price sensitivity and buying power mapped
- Ready for A2-05 (Messaging Pillars)
