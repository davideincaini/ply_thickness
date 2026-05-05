# Prepreg Calculator — Cured Ply Thickness & Fiber Volume

A Progressive Web App (PWA) for calculating the cured ply thickness (CPT) and fiber volume fraction of a prepreg laminate from material inputs. Built for real use on the shop floor — installable on iPhone, works offline.

---

## The Problem

In composite manufacturing, predicting the cured ply thickness from prepreg material specs is a routine but non-trivial calculation. It requires combining fiber areal weight, resin content, fiber density, and resin density through the rule of mixtures. Doing this manually for multiple material combinations is slow and error-prone — this tool makes it instant.

---

## Physics

The app implements the **rule of mixtures** for composite laminates:

**Prepreg Areal Weight** (total, fiber + resin):
```
PAW = FAW / (1 - rc)
```

**Fiber Volume Fraction** (Vf):
```
Vf = (FAW / ρ_f) / [(FAW / ρ_f) + (RAW / ρ_r)]
```

**Laminate Density**:
```
ρ_lam = Vf · ρ_f + (1 - Vf) · ρ_r
```

**Cured Ply Thickness** (CPT):
```
CPT = (PAW / 1000) / ρ_lam     [mm]
```

Where: `FAW` = Fiber Areal Weight (g/m²), `rc` = resin content fraction, `ρ_f` = fiber density (g/cm³), `ρ_r` = resin density (g/cm³), `RAW` = Resin Areal Weight.

---

## Inputs

| Parameter | Source |
|---|---|
| Fiber type | Dropdown (Toray T300, T700G, T700S, T800H...) or custom density |
| Resin system | Dropdown (ARS140GEN, ARS120EST, ARS110TEN...) or custom density |
| Fiber Areal Weight | Standard values (80–1250 g/m²) or custom |
| Resin Content | Slider (%) |

## Outputs

| Result | Unit |
|---|---|
| Nominal Fiber Content | % by weight |
| Prepreg Areal Weight | g/m² |
| Fiber Volume Fraction (Vf) | % |
| Laminate Density | g/cm³ |
| **Cured Ply Thickness (CPT)** | mm |
| Overlap recommendation | mm (based on FAW range) |

---

## Material Database

Pre-loaded fiber densities: Toray T300/FT300, T700G, T700S, T800H and others.

Pre-loaded resin densities: ARS140GEN, ARS120EST, ARS110TEN and others.

All entries are overridable with custom values for materials not in the database.

---

## Technical Stack

- **PWA** — installable on iPhone via Safari, works fully offline
- **Service Worker** (`sw.js`) — caches all assets for offline use
- **Pure HTML / CSS / JavaScript** — no frameworks, no build step
- **iOS-native styling** — system font stack (`-apple-system`), iOS color palette, safe-area support

---

## Install on iPhone

1. Open the app URL in **Safari**
2. Tap the Share button → **Add to Home Screen**
3. The app installs and works offline from that point

---

## Context

Built by a process engineer with direct experience in prepreg layup and autoclave processing. The CPT calculation is one of the first things you need when qualifying a new material or verifying a ply schedule — having it available offline on the shop floor removes a common friction point.

---

*Part of [Davide Incaini's portfolio](https://github.com/davideincaini)*
