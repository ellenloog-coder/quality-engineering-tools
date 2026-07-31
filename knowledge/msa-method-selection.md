---
title: "如何选择 Gage R&R、Kappa 和 Cg/Cgk？"
slug: msa-method-selection
category: 方法论与标准解读
summary: "先看数据类型，再确认是单台量具短期检查还是完整测量系统研究。"
readingTime: 约 3 分钟
updatedAt: 2026-07-31
relatedTool: Measurement System Analysis
tags: [MSA, Gage R&R, Kappa, Cg, Cgk]
---

# 如何选择 Gage R&R、Kappa 和 Cg/Cgk？

## 快速选择

| 当前场景 | 推荐方法 |
|---|---|
| 长度、重量、厚度、扭矩等连续测量数据 | Gage R&R |
| 合格/不合格、有缺陷/无缺陷等分类判断 | 属性一致性分析 / Kappa |
| 用标准件重复检查一台量具的重复性和偏差 | Cg/Cgk |

连续数据看 Gage R&R，分类结果看 Kappa，单台量具短期检查用 Cg/Cgk。三种方法不能相互替代。

## Gage R&R：完整的连续测量系统

Gage R&R 适用于长度、厚度、重量、扭矩、间隙、电压和强度等连续数据，分析设备重复性、人员再现性以及测量误差相对于产品变差或公差的大小。

典型研究包含多个零件、多名操作员和每个零件的重复测量。EV 反映量具重复性，AV 反映人员差异，PV 反映零件之间的真实差异。样件应覆盖实际过程范围。

样品可以重复测量且每位操作员测量同一组零件时，通常使用 **Crossed Gage R&R**。破坏性测试或操作员不能测量同一组零件时，考虑 **Nested Gage R&R**。

## Kappa：分类判断的一致性

合格/不合格、划痕、缺陷等级和颜色判断等分类结果，通常使用属性一致性分析，Kappa 是常用的一致性指标。

应同时检查检验员重复一致率、人员之间的一致率、与参考标准的一致率、错误接受、错误拒绝、关键缺陷漏判和类别代表性。Cohen’s Kappa 常用于两个评价者，Fleiss’ Kappa 适合多个评价者。不能只看一个 Kappa 数字，因为类别比例会影响解释。

## Cg/Cgk：单台量具短期检查

Cg/Cgk（Type 1 Gauge Study）通常由一名操作员使用同一台量具，在受控条件下重复测量一个参考件或标准件。Cg 关注重复测量的离散程度，Cgk 同时考虑重复性和偏差。

Cg 高而 Cgk 低，可能提示量具重复性稳定但存在系统性偏差。Cg/Cgk 没有覆盖不同操作员、不同零件和实际生产条件，因此不能替代 Gage R&R。

## 选择流程

1. 分类判断：选择属性一致性分析 / Kappa。
2. 连续数值、只检查一台量具：选择 Cg/Cgk。
3. 连续数值、需要评价人员、零件和方法组成的完整系统：选择 Gage R&R。
4. 样品可重复测量通常使用交叉型设计；不可重复测量时考虑嵌套型设计。

## 常见错误

- 用 Cg/Cgk 代替完整 Gage R&R；
- 对合格/不合格数据做 Gage R&R；
- 只看总体一致率，不看误判方向；
- 样件没有覆盖实际过程范围；
- 让检验员提前知道属性样品参考答案；
- 把统计门槛当成唯一结论。

## 关联工具

[Measurement System Analysis](https://ellenloog-coder.github.io/measurement-system-analysis-tool/)
