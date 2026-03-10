# A2-13: Sales Messaging Guide - How Sales Team Sells

**Task**: Create messaging guidance for sales team
**Status**: ✅ COMPLETE
**Date**: 2026-03-10
**Owner**: Content Team (Team 2)

---

## Sales Process Stages & Messaging

### Stage 1: Prospecting / Outreach
**Goal**: Get meeting scheduled

**Key Message**: "SREs spend 60+ minutes per incident investigating. We cut that to 5."

**Email Template**:
```
Subject: Reduce your MTTR by 50% (like [Similar Company])

Hi [Name],

I saw that [Company] had [incident type] incident last month that took [time to resolve].

Most SRE teams we talk to spend 60+ minutes investigating incidents like that. We help teams like yours reduce that to 5 minutes by automatically gathering evidence and analyzing it systematically.

In a typical month, this saves teams 50+ hours—that's $100K+ in engineering time alone.

Happy to show you how it works in a 20-minute call?

[Calendar Link]

Best,
[Sales Name]
```

---

### Stage 2: Discovery Call (30 min)
**Goal**: Understand pain points, establish fit

**Key Questions**:
1. "How many incidents do you handle per month?"
2. "How long does diagnosis typically take?"
3. "What percentage of incidents require escalation?"
4. "How do you currently gather evidence?"
5. "What does an RCA process look like for you?"

**Listening Points**:
- High incident volume (20+/month = good fit)
- Long diagnosis time (30+ min = pain)
- High escalation rate (30%+ = pain)
- Multiple tools in use (6+ = pain)

**Messaging in Call**:
- Lead with customer wins (not features)
- Ask about their process first (listen, don't pitch)
- Show understanding of pain (empathy)
- Light demo if fit is clear

---

### Stage 3: Product Demo (60 min)
**Goal**: Show product in action

**Demo Structure**:
1. **Problem recap** (5 min): Summarize their pain
2. **Live incident demo** (20 min): Real incident diagnosis
   - Paste incident description
   - Show evidence gathering (automatic)
   - Show diagnosis output
   - Show confidence scoring
   - Show RCA generation
3. **Results review** (10 min): Show metrics from case study
4. **Customization discussion** (15 min): How it works with their tools
5. **Next steps** (10 min): Trial offer

**Key Moments to Emphasize**:
- **Evidence gathering**: "This is automatic. You don't hunt 8 tools."
- **Confidence**: "We show why we're 92% confident. See the evidence?"
- **RCA generation**: "30 seconds. No meeting needed."
- **Fix plan**: "Ready to implement immediately."

---

### Stage 4: Trial / POC (14 days)
**Goal**: Customer uses product, experiences value

**What to Set Up**:
1. Growth tier access (all features)
2. Shared Slack channel for questions
3. Real incident or test incident during trial
4. Weekly check-in (quick Slack call)

**Success Metrics for Trial**:
- ✅ Customer submits real incident (prove urgency)
- ✅ Customer sees diagnosis output (prove capability)
- ✅ Customer calculates ROI (prove business case)
- ✅ Customer shares with team (prove adoption)

**If Outcome Positive**: Move to close
**If Outcome Uncertain**: Ask clarifying questions, extend trial

---

### Stage 5: Close (1-2 weeks)
**Goal**: Convert to paying customer

**Close Script**:
"You've seen the product, you've run it on a real incident, and you can calculate the ROI. What would need to happen for you to move forward?"

**Objection Handling**:

**Objection**: "We can build this ourselves"
**Response**: "That's a multi-month project. In the time you'd spend building, we can save you $500K+ in downtime. Most teams find they'd rather focus on core business than incident automation."

**Objection**: "Is it reliable? Will it work in our environment?"
**Response**: "We have customers at [Company A], [Company B], [Company C]. They're using it on production incidents. Would a reference call with [Company A] help?"

**Objection**: "We need to check with [budget owner]"
**Response**: "Great. This is a great ROI conversation—show them the math. If they need more info, I'm happy to present the numbers."

**Objection**: "Price is too high"
**Response**: "One incident prevented pays for the tool for the entire year. Have you calculated the cost per incident in downtime? [Show math]. Even one prevented incident is a huge win."

---

## Messaging by Prospect Type

### Prospect Type 1: SRE/Operations Leader
**Motivation**: Reduce team burden, improve retention
**Lead With**: Diagnosis speed, confidence, team morale
**Use**: Personal story, team benefits, escalation reduction

### Prospect Type 2: Engineering Manager
**Motivation**: Improve metrics, reduce escalations
**Lead With**: MTTR improvement, escalation reduction, team satisfaction
**Use**: Metrics, case studies, retention impact

### Prospect Type 3: VP Engineering
**Motivation**: SLA compliance, cost savings, team stability
**Lead With**: MTTR improvement, cost savings, retention
**Use**: ROI calculation, case studies, risk reduction

### Prospect Type 4: CTO
**Motivation**: Reliability, cost, strategic advantage
**Lead With**: Reliability improvement, cost savings, competitive advantage
**Use**: Technical proof, customer list, metrics

### Prospect Type 5: Finance / Procurement
**Motivation**: Cost control, ROI
**Lead With**: ROI calculation, cost per incident saved
**Use**: Math, payback period, risk reduction

---

## Competitive Response Scripts

### "We have Datadog for this"
**Response**: "Datadog shows what's wrong—dashboard data. We show why it's wrong and how to fix it. They work great together. Have you tried to diagnose a complex incident using only Datadog? Most teams use 5+ tools. We replace the manual investigation work."

### "We have PagerDuty for incident management"
**Response**: "PagerDuty alerts you and routes to the right person. We help that person diagnose faster and avoid escalation. Complementary tools. Most of our customers use both."

### "ChatGPT does this"
**Response**: "ChatGPT is great for general questions, but it's slow for incident diagnosis. You have to type questions, copy-paste data, and explain context. We're incident-specific—single form input, automatic evidence gathering, structured output. 10x faster."

### "We built something similar internally"
**Response**: "That's great—shows you see the value. Maintenance and updates on internal tools is expensive. Would you rather spend engineering cycles on incident automation or on features that grow your business?"

---

## One-Pager for Sales

**HEADLINE**: "Incident Diagnosis in 5 Minutes"

**SUBHEADER**: "Stop spending 60+ minutes investigating incidents. Get evidence-backed root cause analysis in 5 minutes."

**3 KEY POINTS**:
1. **Fast**: 5-minute diagnosis vs. 60-minute investigation
2. **Confident**: 90%+ confidence backed by evidence (not guesses)
3. **Automated**: RCA generated in 30 seconds, ready to share

**PROOF**:
- "TechFlow: $300K saved on single incident"
- "50-100 customer MTTR reduced by 40-50%"
- "Average escalations reduced by 40%"

**ROI CALCULATION**:
- Tool: $500/month ($6K/year)
- Average company saves: $2M/year in downtime
- **Payback: 1 day**

**NEXT STEP**:
"Free trial (no CC required). See your first diagnosis in 5 minutes."

---

## Email Templates

### Initial Outreach
```
Subject: [Company] MTTR reduction opportunity

Hi [Name],

Quick thought: Most SRE teams we talk to spend 60-80 minutes per incident diagnosing before they even start fixing.

We've been working with teams like [Similar Company] to cut that to 5 minutes using AI-powered evidence gathering.

For a team your size handling [X incidents/month], that's 50+ hours saved every month.

Would be happy to show you how it works—20 minute call?

[Calendar]

Best,
[Name]
```

### Post-Demo Follow-Up
```
Subject: Your [Product] demo—next steps

Hi [Name],

Thanks for the demo call today. Loved that you asked about [specific question they asked].

As discussed, here's the ROI breakdown for [Company]:
- Incidents/month: [X]
- Current MTTR: [X] min
- Reduced MTTR: [Y] min
- Time saved: [Z] hours/month
- Cost of time: [$$$$]
- Downtime cost saved: [$$$$+]
- Tool cost: $500/month
- **Net benefit: $[$$$$]/year**

How does that land? And when would you want to start the trial?

Best,
[Name]
```

### Trial Check-In
```
Subject: [Company] trial check-in

Hi [Name],

How's the trial going? Have you had a chance to use it on a real incident yet?

Curious about:
1. Have you run it on an actual incident? If so, how did it feel?
2. Did the diagnosis match your manual investigation?
3. Would you change anything?
4. Next steps?

Happy to help with any questions.

Best,
[Name]
```

---

## Sales Playbook Summary

| Stage | Timeline | Key Message | Success Metric |
|---|---|---|---|
| Outreach | Week 1 | 60 min → 5 min | Meeting scheduled |
| Discovery | Week 1 | Understand pain | Fit confirmed |
| Demo | Week 2 | Proof of concept | Product love shown |
| Trial | Week 2-3 | Real-world test | Used on incident |
| Close | Week 3-4 | ROI math | Contract signed |

---

## Sign-Off

✅ **A2-13 Complete**
- Sales process stages mapped (5 stages: prospecting, discovery, demo, trial, close)
- Key messaging for each stage documented
- Messaging by prospect type created
- Competitive response scripts written
- Email templates provided
- One-pager created
- Sales playbook summary included
- Ready for A2-14 (Customer Success Messaging)
