---
title: "What is the difference between Cp, Cpk, Pp and Ppk?"
slug: cp-cpk-pp-ppk-en
category: Methodology & Standards
summary: "Understand the difference between the four process capability indices through within-process variation, overall variation and process centering."
readingTime: About 2 min
updatedAt: 2026-07-31
relatedTool: Process Capability Analysis Tool
tags: [process capability, statistics]
---

# What is the difference between Cp, Cpk, Pp and Ppk?

## Quick takeaways

- Cp and Cpk use within-process variation.
- Pp and Ppk use overall variation.
- Cp and Pp do not account for mean shift.
- Cpk and Ppk account for mean shift.
- A Cpk–Ppk gap may indicate additional variation across groups, batches or time.
- Capability indices do not replace stability, MSA or data-representativeness checks.

## Separate two questions: how wide is the process, and is it centered?

Capability indices describe process output relative to the specification band, but each index observes variation differently. Start by separating the size of variation from whether the mean is shifted away from the target center.

## Within-process variation versus overall variation

Cp and Cpk use within-process variation (*σwithin*), which is closer to short-term performance under local conditions. Pp and Ppk use overall variation (*σoverall*), including additional changes associated with time, batches, shifts, equipment or other conditions.

$$Cp = \frac{USL - LSL}{6 \times \sigma_{within}}$$

$$Cpk = \min\left[\frac{USL - \bar{x}}{3 \times \sigma_{within}}, \frac{\bar{x} - LSL}{3 \times \sigma_{within}}\right]$$

## How to read the four indices together

| Index | Variation estimate | Accounts for mean shift? | Primary use |
|---|---|---|---|
| Cp | Within-process | No | Short-term potential capability |
| Cpk | Within-process | Yes | Short-term actual capability |
| Pp | Overall | No | Long-term potential performance |
| Ppk | Overall | Yes | Long-term actual performance |

## Why one index cannot authorize release

One index describes only one aspect under a particular dataset and set of assumptions. Engineering disposition also requires confirmation that the process is stable, the measurement system is adequate, the data represent actual production conditions, and the specifications and customer requirements are applicable.

### The Cpk–Ppk gap

When Cpk is materially higher than Ppk, additional variation may exist across groups, batches or time. Treat the gap as an investigation lead, not as proof of a root cause.

### Limits of capability indices

Capability indices do not replace control charts, MSA, stratification or engineering review. For non-normal data, mixed distributions, strong trends or unstable processes, a routine interpretation can be misleading.
