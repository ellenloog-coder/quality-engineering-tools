---
title: "How should I choose Gage R&R, Kappa or Cg/Cgk?"
slug: msa-method-selection-en
category: Methodology & Standards
summary: "Choose by data type and study scope: one-gauge short-term behavior or the complete measurement system."
readingTime: About 3 min
updatedAt: 2026-07-31
relatedTool: Measurement System Analysis
tags: [MSA, Gage R&R, Kappa, Cg, Cgk]
---

# How should I choose Gage R&R, Kappa or Cg/Cgk?

## Quick selection

| Scenario | Recommended method |
|---|---|
| Length, weight, thickness, torque or other continuous measurements | Gage R&R |
| Pass/fail, defect/no defect or other categorical judgments | Attribute Agreement / Kappa |
| Short-term repeatability and bias of one gauge using a reference part | Cg/Cgk |

Use Gage R&R for continuous data, Kappa for categorical agreement, and Cg/Cgk for a short-term check of one gauge. They answer different questions.

## Gage R&R: the complete continuous measurement system

Gage R&R analyzes equipment repeatability, appraiser reproducibility and part-to-part variation for length, thickness, weight, torque, gap, voltage and strength measurements.

A typical study includes multiple parts, multiple operators and repeated measurements of each part. Parts should cover the realistic process range. A Crossed design is common when every operator can measure the same parts; a Nested design may be needed for destructive tests or when operators cannot measure the same parts.

## Kappa: agreement for categorical judgments

For pass/fail, scratches, defect grades or color judgments, use Attribute Agreement Analysis; Kappa is a common agreement statistic. Check repeat agreement, between-appraiser agreement, agreement with a reference standard, false accepts, false rejects, missed critical defects and category representation.

Cohen’s Kappa is commonly used for two appraisers; Fleiss’ Kappa supports multiple appraisers. Do not interpret one Kappa value alone because category proportions affect interpretation.

## Cg/Cgk: a short-term gauge check

A Type 1 Gauge Study normally uses one operator, one gauge and one reference part under controlled conditions. Cg focuses on repeatability; Cgk considers repeatability and bias.

A high Cg with a low Cgk can indicate stable repeatability with systematic bias. Cg/Cgk does not cover operators, parts or real production conditions and cannot replace Gage R&R.

## Selection flow

1. Categorical judgment: use Attribute Agreement / Kappa.
2. Continuous result and one gauge only: use Cg/Cgk.
3. Continuous result with operators, parts and method: use Gage R&R.
4. Repeatable samples usually support a Crossed design; non-repeatable samples may require a Nested design.

## Related tool

[Measurement System Analysis](https://ellenloog-coder.github.io/measurement-system-analysis-tool/)
