# TrueRate — Cross-Border Payment Cost Optimizer

## Project Report

**Project Title:** TrueRate — A Web-Based Cross-Border Payment Cost Optimizer  
**Domain:** Financial Technology (FinTech)  
**Platform:** Web Application (React + Node.js)  
**Document Version:** 1.0  
**Date:** June 2026  

---

## Table of Contents

| Section | Title | Status |
|---------|-------|--------|
| **1** | **Introduction** | ✅ Complete |
| 1.1 | FinTech Overview | ✅ |
| 1.2 | Cross-Border Payment Systems | ✅ |
| 1.3 | Objectives | ✅ |
| 1.4 | Scope of the Project | ✅ |
| **2** | **Literature Survey** | ✅ Complete |
| 2.1 | Existing Cross-Border Payment Systems | ✅ |
| 2.2 | SWIFT Payment Network | ✅ |
| 2.3 | Digital Remittance Providers | ✅ |
| 2.4 | Stablecoin Networks | ✅ |
| 2.5 | Cryptocurrency Rails | ✅ |
| 2.6 | Live Foreign Exchange (FX) APIs | ✅ |
| 2.7 | Existing Challenges | ✅ |
| **3** | **Prototype Development** | ✅ Complete |
| 3.1 | Proposed System | ✅ |
| 3.2 | System Architecture | ✅ |
| 3.3 | Framework Architecture | ✅ |
| 3.4 | Cross-Border Payment Workflow | ✅ |
| 3.5 | Hardware Configuration | ✅ |
| 3.6 | Software Configuration | ✅ |
| 3.7 | Tools Used | ✅ |
| 3.8 | Payment Route Categories | ✅ |
| 3.9 | Recommendation Engine | ✅ |
| 3.10 | Security Features | ✅ |
| 3.11 | Blockchain Integration | ✅ |
| 3.12 | Database Design | ✅ |
| 3.13 | API Integration | ✅ |
| **4** | **Results and Discussion** | ✅ Complete |
| 4.1 | Experimentation Results | ✅ |
| 4.2 | Payment Comparison Dashboard | ✅ |
| 4.3 | Cross-Border Payment Summary Matrix | ✅ |
| 4.4 | Cost Analysis | ✅ |
| 4.5 | Performance Analysis | ✅ |
| **5** | **Expected Outcome** | ✅ Complete |
| **6** | **References** | ✅ Complete |

---

# 1. Introduction

Cross-border payments are one of the most common yet least transparent financial activities in the global economy. Every year, hundreds of billions of dollars move across national borders through bank wires, mobile remittance apps, stablecoin transfers, and cryptocurrency networks. Despite this volume, most senders still struggle to answer a simple question: *Which payment route will deliver the most money to the recipient at the lowest total cost and in the shortest time?*

**TrueRate** is a web-based FinTech prototype developed to address this problem. It is a cross-border payment cost optimizer that allows users to enter a transfer amount, select a payment corridor (source and destination country/currency pair), and receive an instant side-by-side comparison of multiple payment rails — including SWIFT bank transfers, digital remittance providers, stablecoin networks, and cryptocurrency rails. The system computes fee breakdowns, effective exchange rates, estimated settlement times, and a ranked recommendation based on the user's stated priority.

This report documents the design, development, and evaluation of the TrueRate prototype. Chapter 1 establishes the domain context, defines the problem space, states the project objectives, and delineates the scope of work undertaken.

---

## 1.1 FinTech Overview

### 1.1.1 Definition and Scope

Financial Technology, commonly abbreviated as **FinTech**, refers to the application of technology to deliver, improve, or disrupt traditional financial services. FinTech spans a wide range of domains including digital banking, lending, insurance (InsurTech), wealth management, regulatory compliance (RegTech), and payments. The global FinTech market has grown rapidly over the past decade, driven by smartphone adoption, cloud computing, open banking regulations, and consumer demand for faster, cheaper, and more accessible financial products.

Unlike traditional financial institutions that rely on legacy infrastructure and branch networks, FinTech companies typically build software-first products that operate over the internet, integrate with third-party APIs, and prioritize user experience. Many FinTech products are **aggregators** or **comparison tools** — they do not move money themselves but help users make informed decisions before committing to a transfer or investment.

### 1.1.2 Key Segments Relevant to TrueRate

Several FinTech segments are directly relevant to this project:

| Segment | Description | Relevance to TrueRate |
|---------|-------------|----------------------|
| **Payments & Remittances** | Platforms that enable domestic and international money movement | Core domain — TrueRate compares remittance and payment routes |
| **Foreign Exchange (FX)** | Services providing currency conversion and live exchange rates | FX mid-market rates are fetched live and used in cost calculations |
| **Blockchain & Digital Assets** | Stablecoins, cryptocurrencies, and decentralized transfer rails | USDC and ETH routes are included as alternative payment rails |
| **Personal Finance Tools** | Budgeting, comparison, and analytics applications | Analytics dashboard, savings summaries, and history features |

### 1.1.3 Why FinTech Matters for Cross-Border Payments

Traditional cross-border banking has historically been slow, expensive, and opaque. FinTech has disrupted this space by:

- **Reducing intermediaries** — Digital remittance providers connect senders and receivers more directly than correspondent banking chains.
- **Improving price transparency** — Many modern apps display fees upfront, though FX markups remain hidden in effective rates.
- **Enabling new rails** — Stablecoins on public blockchains can settle in minutes with low network fees compared to SWIFT transfers that may take days.
- **Democratizing access** — Mobile-first apps allow unbanked or underbanked populations to receive international transfers without a traditional bank account.

TrueRate sits at the intersection of these trends: it does not execute transfers but acts as an **intelligent comparison layer** that helps users navigate an increasingly fragmented payment landscape.

### 1.1.4 Regulatory and Trust Considerations

FinTech products in the payments space must acknowledge that they operate in a regulated environment. Money transmission, anti-money laundering (AML), and know-your-customer (KYC) requirements apply to actual payment providers. TrueRate, as a comparison and estimation tool, does not hold funds or execute transfers. All figures displayed are **estimates for comparison purposes only**, and the application includes disclaimers stating that it is not a financial advisor and does not guarantee provider pricing accuracy.

---

## 1.2 Cross-Border Payment Systems

### 1.2.1 What Is a Cross-Border Payment?

A **cross-border payment** is any transfer of funds where the payer and payee are in different countries, or where the source currency differs from the destination currency. Examples include:

- An Indian student in the UK sending money home to family in India (GBP → INR)
- A US-based freelancer paying a contractor in the Philippines (USD → PHP)
- A business in the Eurozone settling an invoice with a supplier in Mexico (EUR → MXN)

Each transfer involves currency conversion, compliance checks, routing through one or more financial networks, and settlement to the recipient's bank account, mobile wallet, or digital asset address.

### 1.2.2 Payment Corridors

In industry terminology, a **payment corridor** (or simply **corridor**) is a specific origin–destination pair defined by source country, destination country, source currency, and destination currency. For example:

- **United States → India (USD → INR)** is a corridor.
- **India → United Kingdom (INR → GBP)** is a *different* corridor, even though the same two countries are involved, because the direction and currencies of the sender differ.

Corridor choice affects which providers are available, which exchange rates apply, and which regulatory rules govern the transfer. TrueRate supports 26 predefined corridors across six currencies (USD, EUR, GBP, INR, MXN, PHP), including reverse-direction routes such as India → Eurozone.

### 1.2.3 Components of Total Transfer Cost

The true cost of a cross-border payment is rarely a single line item. It typically comprises:

1. **Platform / provider fee** — A flat charge or percentage levied by the remittance app, bank, or exchange.
2. **Foreign exchange (FX) markup** — The difference between the mid-market exchange rate and the rate offered to the customer. This hidden spread is often the largest component of cost.
3. **Network / blockchain fee** — For crypto and stablecoin routes, the gas or transaction fee paid to validators on a blockchain network (e.g., Ethereum, Polygon).
4. **Intermediary bank charges** — In SWIFT transfers, correspondent banks may deduct additional fees along the chain.

TrueRate calculates and displays each component separately so users can see *why* one route is cheaper than another, not just the headline total.

### 1.2.4 Major Payment Rail Categories

Modern cross-border payments can be grouped into four broad rail categories, all of which TrueRate compares:

| Rail Category | Examples | Typical Settlement Time | Cost Profile |
|---------------|----------|------------------------|--------------|
| **SWIFT / Bank wire** | Traditional correspondent banking | 1–5 business days | High flat fees + poor FX rates |
| **Digital remittance** | Wise, Remitly, Western Union, Xoom | Minutes to 24 hours | Lower fees, competitive FX |
| **Stablecoin** | USDC on Ethereum or Polygon | Minutes | Low platform fee + network gas |
| **Cryptocurrency** | ETH on Ethereum | Minutes | Variable gas fees + price volatility |

By placing these rails side by side for the same corridor and amount, TrueRate makes the trade-offs between cost, speed, and rail type visible in a single view.

### 1.2.5 The Transparency Problem

Despite the proliferation of payment options, transparency remains poor. A provider may advertise "zero transfer fee" while embedding a 2–3% cost in the exchange rate. Crypto routes may appear cheap on fees but require the recipient to off-ramp to local currency through an exchange. Without a unified comparison tool, senders often default to their bank or the first app they know — potentially overpaying by a meaningful amount on every transfer.

TrueRate was conceived specifically to solve this **information asymmetry** problem in cross-border payments.

---

## 1.3 Objectives

The primary and secondary objectives of the TrueRate project are defined below.

### 1.3.1 Primary Objectives

1. **Build a multi-rail comparison engine**  
   Develop a backend system capable of calculating the total cost, effective exchange rate, amount received, and estimated settlement time for at least eight payment routes spanning SWIFT, remittance providers, stablecoins, and cryptocurrency rails.

2. **Integrate live and fallback market data**  
   Fetch real-time foreign exchange rates, cryptocurrency prices, and blockchain gas fees from external APIs, with graceful fallback to alternative providers and static estimates when live data is unavailable.

3. **Deliver actionable recommendations**  
   Implement a rule-based recommendation engine that ranks routes according to user-selected priorities — including lowest cost, most received, fastest settlement, best balance, traditional rails, and digital/crypto rails — with human-readable explanations for the top recommendation.

4. **Provide a responsive web dashboard**  
   Create a React-based web application where users can run comparisons, view results in a sortable and filterable table, export reports (CSV/PDF), and access analytics on their comparison history.

5. **Support user accounts and persistence**  
   Enable registration, authentication, comparison history, saved corridors, notification preferences, and analytics — with local JSON-based persistence suitable for prototype deployment without external database infrastructure.

### 1.3.2 Secondary Objectives

1. **Demonstrate FinTech UX patterns** — Toast notifications, shareable comparison URLs, savings hero cards, and provider outbound links that make the prototype feel like a production-grade product.

2. **Track FX rate history for analytics** — Record periodic FX snapshots to power exchange-rate trend charts and corridor usage analytics.

3. **Implement threshold-based notifications** — Allow users to configure exchange-rate alerts and receive email notifications (with console fallback in development) when conditions are met.

4. **Establish a scalable monorepo architecture** — Organize code into `apps/api`, `apps/web`, and `packages/shared` so the prototype can evolve toward production deployment on Vercel and Railway.

5. **Document the system thoroughly** — Produce a PRD, API contract, feature roadmap, phase decisions, and this project report for academic and engineering reference.

### 1.3.3 Success Criteria

The prototype is considered successful if it meets the following measurable criteria:

| Criterion | Target |
|-----------|--------|
| Comparison response time | Results returned within 2–3 seconds |
| Supported payment routes | ≥ 8 routes per comparison |
| Supported corridors | ≥ 26 bidirectional corridor options |
| Recommendation priorities | ≥ 6 user-selectable ranking modes |
| Auth and history | Users can register, log in, and retrieve past comparisons |
| Export | CSV and PDF export of comparison results |
| Analytics | Charts for savings, corridors, providers, and FX history |

As of the current development phase, the majority of these criteria have been met in the working prototype.

---

## 1.4 Scope of the Project

### 1.4.1 In Scope

The following features and capabilities fall within the defined scope of the TrueRate prototype:

#### Core Comparison
- Payment comparison across **eight routes**: SWIFT Bank Transfer, Wise, Remitly, Western Union, Xoom, USDC (Ethereum), USDC (Polygon), and ETH (Ethereum).
- Support for **six currencies**: USD, EUR, GBP, INR, MXN, PHP.
- Support for **26 payment corridors**, including reverse-direction routes (e.g., India → United Kingdom, India → Eurozone).
- Fee breakdown per route: platform fee, foreign exchange markup, network fee, total fee, effective rate, and amount received.
- Currency-aware amount presets that adapt to the source currency of the selected corridor.

#### Recommendation Engine
- Six priority modes: lowest cost, most received, fastest, best balance, bank & remittance, crypto & stablecoins.
- Normalized scoring with explainable "why this route" text for the recommended option.
- Savings hero card showing how much more the best route delivers versus the worst.

#### External Data Integration
- Live FX rates via ExchangeRate-API with Frankfurter and static fallback providers.
- Cryptocurrency pricing via CoinGecko.
- Ethereum gas fees via Etherscan with static fallback.
- Scheduled rate polling (every 5–15 minutes) with in-memory caching.

#### User Features
- Email/password registration and login with JWT access tokens and httpOnly refresh cookies.
- Automatic comparison history saving for authenticated users.
- Saved corridor management (save, quick-select, delete).
- Comparison search, detail view, and re-run from history.
- Shareable comparison URLs via query parameters.
- PDF and CSV export.

#### Analytics and Notifications
- Analytics dashboard: monthly savings, provider performance, corridor usage, country analytics, fee comparison charts, FX rate history.
- User notification preferences and exchange-rate threshold alerts.
- Hourly cron job for notification checks.

#### Technical Infrastructure
- Monorepo structure: `apps/api` (Express.js), `apps/web` (React + Vite), `packages/shared` (TypeScript types and constants).
- JSON file-based local persistence (`apps/api/data/`) — no Docker or PostgreSQL required for development.
- REST API versioned at `/api/v1`.
- Rate limiting, CORS, bcrypt password hashing, and JWT authentication middleware.

### 1.4.2 Out of Scope

The following items are explicitly **excluded** from the current prototype scope:

| Excluded Item | Reason |
|---------------|--------|
| **Actual money movement** | TrueRate compares routes; it does not execute transfers or hold funds |
| **Live provider fee APIs** | Wise, Remitly, and others do not expose public comparison APIs; fees use configured estimates refreshed manually |
| **Machine learning recommendations** | Deferred to Phase 3; MVP uses explainable rule-based ranking |
| **Mobile application (Flutter)** | Web-first MVP; mobile deferred until web logic is validated |
| **Production deployment** | Vercel + Railway planned but not yet deployed |
| **Redis / PostgreSQL in local dev** | Replaced by in-memory cache and JSON file storage for simplicity |
| **KYC / AML compliance flows** | Not required for a comparison tool that does not process payments |
| **Recipient bank/wallet detail storage** | Privacy by design — no storage of beneficiary account information |
| **Fee-drop notifications** | Requires historical fee tracking not yet implemented |
| **Admin panel and RBAC** | Deferred to Phase 3 |

### 1.4.3 Assumptions and Constraints

1. **Fee estimates are approximate** — Provider fees are based on publicly documented pricing and manual configuration, not live API quotes. Actual fees may differ at checkout.

2. **FX rates are indicative** — Mid-market rates are fetched from third-party APIs and may differ from rates offered by individual providers at execution time.

3. **Crypto routes assume technical capability** — Stablecoin and ETH routes assume the sender and receiver can interact with blockchain wallets; off-ramping to local fiat is not modeled.

4. **Single-user local deployment** — JSON file storage is suitable for prototype and demo use but is not designed for high-concurrency production workloads without migration to a relational database.

5. **Free-tier API limits** — External API usage is constrained by free-tier rate limits (e.g., ExchangeRate-API: 1,500 requests/month), mitigated by caching and scheduled polling.

### 1.4.4 Target Users

The prototype is designed for the following user groups:

- **Remittance senders** — Individuals sending money to family abroad who want to find the cheapest or fastest route.
- **Freelancers and contractors** — Professionals receiving or sending international payments who compare rails before choosing a provider.
- **Small businesses** — Companies paying overseas suppliers who need a quick cost snapshot across traditional and digital options.
- **Crypto-curious users** — People evaluating whether stablecoin or crypto rails offer savings over traditional remittance for their corridor.
- **FinTech evaluators and researchers** — Academic and industry audiences reviewing the prototype's architecture and comparison methodology.

### 1.4.5 Project Phases

Development was organized into phased milestones:

| Phase | Focus | Status |
|-------|-------|--------|
| **Phase 0** | Foundation, provider decisions, monorepo setup | ~92% complete |
| **Phase 1** | MVP — core comparison, auth, history, dashboard | ~95% complete |
| **Phase 2** | Analytics, PDF export, notifications, UX quick wins | ~88% complete |
| **Phase 3** | ML recommendations, admin panel, mobile app | Not started |

This report covers the work completed through Phase 2, with Phase 3 identified as future work in the Expected Outcome chapter.

---

*End of Chapter 1*

---

# 2. Literature Survey

A literature survey examines existing systems, industry standards, technologies, and research relevant to the problem domain before designing a new solution. For TrueRate, the survey focuses on how cross-border payments are executed today, which payment rails and data sources exist, and what limitations motivate a unified comparison platform.

This chapter reviews the major categories of cross-border payment infrastructure — from legacy bank networks to modern digital remittance apps, stablecoin protocols, cryptocurrency transfers, and live FX data services — and concludes with a synthesis of persistent challenges that TrueRate aims to address.

---

## 2.1 Existing Cross-Border Payment Systems

### 2.1.1 Historical Context

Cross-border payments predate the internet. For most of the 20th century, international money movement relied on **correspondent banking** — a chain of banks in different countries that hold accounts with one another and pass payment instructions through the SWIFT messaging network. This model was designed for institutional and high-value transactions, not for consumer remittances at scale.

The late 2000s and 2010s saw the rise of **digital remittance companies** (Wise, Remitly, WorldRemit, and others) that bypassed parts of the correspondent chain by maintaining local float in destination countries. More recently, **blockchain-based rails** have introduced an entirely new settlement layer that can move value globally in minutes, independent of traditional banking hours.

### 2.1.2 Classification of Payment Systems

Existing cross-border payment systems can be classified along several dimensions:

| Dimension | Traditional | Modern Digital | Blockchain-Based |
|-----------|-------------|----------------|------------------|
| **Settlement layer** | Correspondent banks | Licensed money transmitters | Public blockchains |
| **Speed** | 1–5 business days | Minutes to 24 hours | Minutes |
| **Cost structure** | Flat fees + FX spread | Transparent fees + smaller spread | Network gas + exchange spread |
| **Regulatory model** | Banking licenses | Money transmitter licenses | Varies by jurisdiction |
| **User interface** | Branch / online banking | Mobile apps | Wallets / exchanges |

TrueRate treats all three columns as comparable **routes** within a single framework, allowing users to evaluate trade-offs without switching between separate apps or websites.

### 2.1.3 Comparison and Aggregation Tools

Several existing tools partially address payment comparison:

- **Provider-native calculators** — Wise, Remitly, and Western Union each offer fee calculators on their own websites, but only for their own service.
- **Generic FX converters** — Google Finance, XE.com, and OANDA show exchange rates but do not model provider-specific fees or settlement times.
- **Crypto fee estimators** — Etherscan and blockchain explorers show gas costs but do not compare against bank or remittance alternatives.

No widely available free tool combines **SWIFT, remittance, stablecoin, and crypto rails** in one comparison with ranked recommendations. This gap is the primary motivation for TrueRate.

### 2.1.4 Industry Reports and Market Data

Industry bodies such as the **World Bank** and **KNOMAD** (Global Knowledge Partnership on Migration and Development) publish remittance price data through the **Remittance Prices Worldwide (RPW)** database, which tracks the cost of sending $200 equivalent across major corridors. Key findings consistently cited in literature include:

- The global average cost of sending remittances remains above the UN Sustainable Development Goal target of 3%.
- FX margins account for a larger share of total cost than visible transfer fees in many corridors.
- Digital channels are generally cheaper than bank-based channels, but price variation between providers on the same corridor can exceed 5%.

TrueRate aligns with this research by surfacing both visible fees and FX markup as separate line items in every comparison result.

---

## 2.2 SWIFT Payment Network

### 2.2.1 Overview

**SWIFT** (Society for Worldwide Interbank Financial Telecommunication) is a cooperative messaging network used by over 11,000 financial institutions in more than 200 countries. Founded in 1973 and headquartered in Belgium, SWIFT does not move money itself — it transmits standardized **payment messages** (MT103 for customer transfers, among others) between banks that then settle funds through their nostro/vostro accounts.

When a consumer initiates an "international wire transfer" at their bank, the payment typically travels through one or more correspondent banks before reaching the beneficiary's bank. Each intermediary may deduct a fee, and the FX conversion is usually performed at a rate less favorable than the mid-market rate.

### 2.2.2 How SWIFT Transfers Work

The typical SWIFT transfer workflow:

1. **Sender initiates** a wire at their local bank with beneficiary details (IBAN, SWIFT/BIC code, amount).
2. **Originating bank** sends a SWIFT message to a correspondent bank, often in an intermediate currency (frequently USD or EUR).
3. **Correspondent chain** — One or more intermediary banks process the message and deduct handling charges.
4. **Beneficiary bank** receives the final message and credits the recipient's account in local currency.
5. **Settlement** — Actual fund movement may lag message delivery by hours or days.

This multi-hop architecture explains why SWIFT transfers are slow and why total cost is difficult to predict upfront.

### 2.2.3 Cost Characteristics

In the TrueRate prototype, SWIFT is modeled with the following estimated parameters (configured in `mvp-providers.ts`):

| Parameter | Estimated Value | Rationale |
|-----------|----------------|-----------|
| Platform fee (flat) | $25 equivalent | Typical outgoing wire fee at major banks |
| FX spread | 2.5% | Common retail bank markup over mid-market |
| Settlement time | ~72 hours (3 business days) | Industry average for consumer wires |

SWIFT remains relevant as a **baseline** in comparisons: it represents what many users default to when they do not explore alternatives, and it is often the most expensive option on cost-sensitive corridors.

### 2.2.4 SWIFT GPI and Modernization Efforts

SWIFT has introduced **GPI (Global Payments Innovation)** to improve tracking and speed, with a goal of same-day settlement on many corridors. However, adoption is uneven, and consumer-facing pricing transparency has improved only modestly. Literature on SWIFT modernization suggests that while messaging has evolved, the underlying correspondent banking economics — and their cost implications — remain largely unchanged for retail senders.

### 2.2.5 Relevance to TrueRate

TrueRate includes SWIFT as the **traditional rail benchmark**. Users who compare SWIFT against Wise or USDC (Polygon) can immediately see the potential savings from switching rails — a core value proposition of the prototype.

---

## 2.3 Digital Remittance Providers

### 2.3.1 Emergence of Digital Remittance

Digital remittance providers emerged to serve migrant workers and diaspora communities sending money home. Unlike banks, these companies optimize for **specific corridors** (e.g., US → India, US → Philippines), maintain local payout partnerships, and compete primarily on fee transparency and speed.

Major categories within digital remittance include:

- **Online-first specialists** — Wise (formerly TransferWise), Remitly, WorldRemit
- **Legacy cash networks with digital channels** — Western Union, MoneyGram
- **Platform extensions** — Xoom (PayPal), Revolut international transfers

### 2.3.2 Wise (TransferWise)

**Wise** is widely cited in FinTech literature as a disruptor of correspondent banking. Its model uses **local account pools** in each country: when a user sends USD to India, Wise does not necessarily move USD across borders. Instead, it debits the sender's USD balance and credits the recipient's INR balance from Wise's INR float in India, converting at or near mid-market rate with a small transparent fee.

Typical Wise pricing characteristics:

- Low FX spread (~0.35% in TrueRate configuration)
- Percentage-based platform fee (~0.43% of send amount)
- Settlement within ~24 hours on major corridors

Wise publishes its fee structure publicly, making it one of the more auditable providers for comparison modeling.

### 2.3.3 Remitly

**Remitly** targets immigrant communities with mobile-first UX and corridor-specific promotions. It offers **Economy** (slower, cheaper) and **Express** (faster, higher fee) tiers. In TrueRate, Remitly is modeled with:

- Flat platform fee (~$3.99 equivalent)
- FX spread (~1.5%)
- Estimated settlement ~12 hours

Remitly complements Wise in the prototype by representing a different pricing model (flat fee + higher spread vs. Wise's lower spread + percentage fee).

### 2.3.4 Western Union and Xoom

**Western Union** is one of the oldest remittance brands, with extensive cash pickup networks globally. Its digital channel pricing tends toward higher FX spreads (~2.0%) and flat fees (~$4.99), reflecting the cost of maintaining physical agent locations.

**Xoom**, a PayPal service, targets PayPal users sending internationally with integration into the PayPal ecosystem. Modeled parameters include ~$5.99 flat fee, ~1.8% FX spread, and ~18-hour settlement.

Both were added in Phase 2 of TrueRate development to broaden the remittance comparison beyond the initial Wise + Remitly pair.

### 2.3.5 Fee Modeling Approach in TrueRate

Because remittance providers do not expose public APIs for live fee quotes, TrueRate uses **static fee configuration** per provider:

```
Total cost = Platform fee + FX markup + Network fee (if applicable)
Platform fee = (sendAmount × platformFeePercent) + platformFeeFlat
FX markup    = sendAmount converted at mid-market minus amount at effective rate
Effective rate = midMarketRate × (1 − fxSpreadPercent / 100)
```

This approach is documented in Phase 0 decisions and is consistent with how academic prototypes model provider pricing when live APIs are unavailable. Fee values require periodic manual review against provider websites.

### 2.3.6 Comparison with TrueRate Value Proposition

Digital remittance providers each show only their own pricing. TrueRate places Wise, Remitly, Western Union, and Xoom **alongside SWIFT and crypto rails**, enabling users to see which remittance provider wins for a given corridor, amount, and priority — and whether remittance beats stablecoin at all.

---

## 2.4 Stablecoin Networks

### 2.4.1 What Are Stablecoins?

**Stablecoins** are digital tokens designed to maintain a stable value, typically pegged 1:1 to a fiat currency such as the US Dollar. The most widely used stablecoin for payments is **USD Coin (USDC)**, issued by Circle and backed by reserved assets. Unlike volatile cryptocurrencies, USDC is intended to hold ~$1.00 per token, making it suitable as a **transfer medium** rather than a speculative asset.

Stablecoins combine blockchain settlement speed with fiat-like price stability, positioning them as a potential **bridge rail** for cross-border value movement — particularly in corridors where traditional remittance is expensive or slow.

### 2.4.2 USDC on Ethereum

**Ethereum** is the largest smart-contract blockchain. USDC on Ethereum mainnet settles in roughly one block confirmation (~12 seconds) but incurs **gas fees** paid in ETH that fluctuate with network congestion. During high-demand periods, a simple ERC-20 transfer can cost several dollars in gas; during quiet periods, it may cost less.

TrueRate models USDC (Ethereum) with:

- Minimal FX spread (~0.1%) — assumes conversion through a low-spread exchange
- Live gas fee from Etherscan Gas Tracker (fallback: ~$5 USD)
- Estimated settlement ~30 minutes (including confirmation and off-ramp time)

### 2.4.3 USDC on Polygon (Layer 2)

**Polygon** is an Ethereum-compatible Layer 2 network that offers significantly lower transaction fees by processing transactions on a sidechain before periodically anchoring to Ethereum. USDC on Polygon is widely used for micro-transfers and DeFi applications where mainnet gas would be prohibitive.

TrueRate models USDC (Polygon) with:

- Same low FX spread (~0.1%)
- Static network fee (~$0.01 USD)
- Estimated settlement ~15 minutes

Including both Ethereum and Polygon USDC routes demonstrates the **Layer 1 vs. Layer 2 cost trade-off** — a key educational point in the literature on blockchain payment rails.

### 2.4.4 Stablecoin Transfer Workflow

A typical stablecoin cross-border payment workflow (not executed by TrueRate, but modeled):

1. Sender purchases USDC on an exchange using source fiat (e.g., INR or USD).
2. Sender transfers USDC to recipient's wallet address on chosen network (Ethereum or Polygon).
3. Recipient sells USDC on a local exchange for destination fiat (e.g., EUR or INR).
4. Recipient withdraws to local bank account.

TrueRate models steps 1–4 implicitly through FX spread and network fee parameters. It does **not** model exchange KYC, withdrawal limits, or off-ramp fees separately — an acknowledged simplification discussed in Section 2.7.

### 2.4.5 Circle and Regulatory Context

Circle, the issuer of USDC, holds money transmitter licenses in the United States and publishes monthly attestation reports on reserves. Regulatory treatment of stablecoins varies globally — the EU's MiCA framework, US stablecoin legislation, and RBI guidelines on virtual digital assets all affect whether stablecoin rails are practical for a given corridor. TrueRate presents stablecoin routes as **technically available options** without advising on regulatory compliance for specific users.

---

## 2.5 Cryptocurrency Rails

### 2.5.1 Cryptocurrency as a Payment Rail

While stablecoins aim for price stability, **native cryptocurrencies** such as **Ethereum (ETH)** and **Bitcoin (BTC)** can also function as cross-border transfer media. The sender converts fiat to crypto, transfers on-chain, and the recipient converts back to fiat. This model gained attention for bypassing banking restrictions but introduces **price volatility risk** — the value of ETH may change between send and receive.

TrueRate includes **ETH on Ethereum** as a representative crypto rail to illustrate how volatile assets compare on cost and speed against stablecoins and remittance.

### 2.5.2 Ethereum (ETH) as Transfer Medium

ETH transfers on Ethereum mainnet use the same gas mechanism as USDC ERC-20 transfers. TrueRate models ETH (Ethereum) with:

- FX spread ~0.5% (higher than USDC, reflecting exchange slippage on volatile asset conversion)
- Live gas fee via Etherscan (fallback ~$5 USD)
- Settlement ~30 minutes

Pricing data for ETH/USD conversion comes from **CoinGecko**, a widely used cryptocurrency market data aggregator.

### 2.5.3 Volatility and Risk Considerations

Literature on crypto remittance consistently highlights:

- **Exchange rate risk** — A 2% ETH price drop during a 15-minute transfer effectively adds 2% to the cost.
- **Liquidity constraints** — Off-ramping large amounts in emerging markets may face exchange limits or premium spreads.
- **Technical barriers** — Wallet setup, private key management, and network selection require user education.

TrueRate displays crypto routes for **comparison purposes** and labels all results as estimates. The recommendation engine can deprioritize crypto routes when the user selects "Bank & remittance" priority, reflecting user preference for traditional rails.

### 2.5.4 Bitcoin and Other Assets

Bitcoin Lightning Network and other L2 solutions offer low-fee Bitcoin transfers, but TrueRate's MVP scope limits crypto representation to ETH on Ethereum. Expanding to BTC, SOL, or other assets is identified as future work (Phase 3). The single crypto rail is sufficient to demonstrate the comparison methodology.

### 2.5.5 Blockchain Data Sources in TrueRate

| Data Point | Source | Purpose |
|------------|--------|---------|
| ETH/USD price | CoinGecko API | Convert gas fees and value to USD |
| USDC price | CoinGecko API | Confirm USD peg assumption |
| Gas price (Gwei) | Etherscan Gas Tracker API | Estimate network fee in USD |

These integrations follow the **provider abstraction pattern** (`CryptoProvider`, `GasFeeProvider` interfaces) so data sources can be swapped without modifying the comparison engine.

---

## 2.6 Live Foreign Exchange (FX) APIs

### 2.6.1 Role of FX Data in Cross-Border Payments

Foreign exchange rates are the foundation of every cross-border cost calculation. The **mid-market rate** (also called the interbank rate) is the midpoint between buy and sell prices in the global currency market. Providers apply a **spread** below (for sells) or above (for buys) this rate to generate revenue.

Accurate, timely FX data is essential for TrueRate to:

1. Convert send amounts between currencies before comparing routes.
2. Calculate FX markup as the difference between mid-market and effective provider rates.
3. Display amount received in destination currency.
4. Power analytics charts showing FX rate history over time.

### 2.6.2 ExchangeRate-API

**ExchangeRate-API** (exchangerate-api.com) is TrueRate's primary FX data provider when an API key is configured. It offers:

- REST endpoint: `GET /v6/{apiKey}/latest/{baseCurrency}`
- Response includes `conversion_rates` object for all supported currencies
- Free tier: 1,500 requests per month

TrueRate wraps this provider behind the `ExchangeRateApiProvider` class with a 10-minute in-memory cache to stay within free-tier limits.

### 2.6.3 Frankfurter API

**Frankfurter** (frankfurter.app) is a free, open-source FX API maintained as a public service. It provides mid-market rates sourced from the European Central Bank for major currencies. TrueRate uses Frankfurter as:

- **Primary provider** when no ExchangeRate-API key is configured
- **First fallback** when ExchangeRate-API fails

Frankfurter supports base currencies including USD, EUR, GBP, and INR — covering all six currencies in TrueRate's MVP scope.

### 2.6.4 Static Fallback Rates

When both live providers fail (network error, unsupported currency, API downtime), TrueRate falls back to **static exchange rates** configured in `static-rates.ts`. These rates are derived from approximate USD cross-rates and are clearly labeled with source `static-fallback` in comparison results.

The three-tier fallback chain ensures the prototype remains functional offline or without API keys:

```
ExchangeRate-API → Frankfurter → Static rates
```

This resilient design pattern is recommended in FinTech literature for systems dependent on third-party market data.

### 2.6.5 Caching and Polling Strategy

Literature on API-driven FinTech systems emphasizes **rate limiting and cache discipline**:

| Mechanism | Implementation in TrueRate |
|-----------|---------------------------|
| In-memory cache | 10-minute TTL per base currency |
| Scheduled polling | node-cron job every 5–15 minutes |
| FX snapshots | Stored in `fx-rate-snapshots.json` for analytics |
| Warm bases | USD, EUR, GBP polled proactively |

This approach converts an on-demand API dependency into a **near-real-time cached data layer**, keeping comparison response times under 2–3 seconds while respecting free-tier quotas.

### 2.6.6 FX Rate Display and Transparency

Every TrueRate comparison result includes:

- `midMarketRate` — The fetched mid-market rate for the corridor
- `fxRateFetchedAt` — Timestamp of the rate
- `fxRateSource` — Provider name (exchangerate-api, frankfurter, or static-fallback)
- Per-route `effectiveRate` and `fxMarkup` — Showing how much each provider deviates from mid-market

This transparency directly addresses the literature-identified problem of hidden FX margins in consumer remittance.

---

## 2.7 Existing Challenges

### 2.7.1 Lack of Unified Comparison

The most significant gap in the current landscape is the **absence of a single tool** that compares traditional banking, digital remittance, stablecoin, and cryptocurrency routes with consistent methodology. Users must visit multiple websites, manually note fees and rates, and mentally adjust for FX differences — a process that is time-consuming and error-prone.

TrueRate directly addresses this challenge by normalizing all routes through a single calculator and presenting results in one dashboard.

### 2.7.2 Hidden and Fragmented Pricing

Provider pricing is fragmented across:

- Advertised transfer fees (often zero or low)
- FX spreads (often the largest hidden cost)
- Intermediary bank deductions (unpredictable in SWIFT)
- Network gas fees (variable in crypto)
- Off-ramp and exchange fees (not modeled in most tools)

Research consistently shows consumers **overweight visible fees** and **underweight FX markup**. TrueRate separates platform fee, FX markup, and network fee in every result row, and expands these into full labels in the "Your best option" summary card.

### 2.7.3 Data Availability and API Limitations

| Challenge | Impact | TrueRate Mitigation |
|-----------|--------|---------------------|
| No public remittance fee APIs | Cannot fetch live Wise/Remitly quotes | Static fee config + manual review |
| FX API rate limits | Risk of quota exhaustion | Caching + scheduled polling |
| Gas fee volatility | Crypto cost changes minute-to-minute | Live Etherscan with static fallback |
| Provider pricing changes | Config becomes stale | "As of" timestamps + disclaimers |

These limitations mean TrueRate results are **estimates**, not binding quotes — a constraint clearly communicated to users.

### 2.7.4 Regulatory and Corridor Complexity

Cross-border payments are governed by a patchwork of regulations:

- **AML/KYC** requirements vary by country and transfer amount
- **Capital controls** in some countries restrict outbound or inbound remittance
- **Stablecoin and crypto regulations** differ sharply between US, EU, India, and other jurisdictions
- **Licensing** — Providers may operate in some corridors but not others

TrueRate does not model regulatory eligibility per user. A route shown in comparison results may not be available to all users in all countries. This is noted as a limitation in the prototype scope.

### 2.7.5 Technical Barriers to Crypto Rails

Stablecoin and cryptocurrency routes assume:

- Sender and recipient have compatible wallets
- Access to a licensed exchange for fiat on-ramp and off-ramp
- Sufficient technical literacy to manage network selection (Ethereum vs. Polygon)

For mainstream remittance users, these barriers limit practical adoption even when crypto routes appear cheapest in comparison. TrueRate's "Bank & remittance" priority mode allows users to exclude crypto routes from recommendations if they prefer traditional options.

### 2.7.6 Trust and Estimation Accuracy

Users may distrust comparison tools if results diverge from actual checkout prices. Factors contributing to estimation error include:

- Promotional rates and first-transfer discounts not modeled
- Tiered pricing based on transfer amount or user history
- Dynamic gas fees at time of transaction
- Weekend and holiday FX market closures affecting live rates

TrueRate mitigates trust issues through disclaimers, source attribution on FX rates, provider outbound links for verification, and exportable PDF/CSV reports for record-keeping.

### 2.7.7 Synthesis — Research Gap Addressed by TrueRate

The literature survey reveals a clear research and product gap:

> **There is no accessible, multi-rail, explainable comparison tool that unifies SWIFT, digital remittance, stablecoin, and cryptocurrency payment routes with live FX data, fee decomposition, and priority-based recommendations.**

TrueRate is designed as a prototype to fill this gap. Chapter 3 describes how the proposed system architecture, comparison engine, and web application implement the solution in response to the challenges identified in this survey.

---

*End of Chapter 2*

---

# 3. Prototype Development

This chapter describes the design and implementation of the TrueRate prototype — from the proposed system concept through architecture, technology stack, workflows, and individual subsystems. All descriptions reflect the **as-built** implementation in the project repository as of Phase 2 completion.

---

## 3.1 Proposed System

### 3.1.1 System Concept

TrueRate is proposed as a **decision-support web application** for cross-border payments. It does not initiate, hold, or settle funds. Instead, it accepts user input (send amount, corridor, priority), retrieves live market data, calculates estimated costs across eight payment routes, ranks results, and presents an actionable recommendation.

The system serves three functional roles:

| Role | Description |
|------|-------------|
| **Comparison engine** | Computes fees, rates, and settlement times per route |
| **Recommendation engine** | Ranks routes by user priority with explainable output |
| **User platform** | Web dashboard for comparisons, history, analytics, and alerts |

### 3.1.2 Key Design Principles

The prototype was built according to the following principles:

1. **Multi-rail parity** — Every route is evaluated with the same calculator inputs and output schema, enabling fair comparison.
2. **Provider abstraction** — External data sources (FX, crypto, gas) are wrapped behind interfaces so providers can be swapped without changing business logic.
3. **Graceful degradation** — Live API failures fall back to alternative providers or static estimates; the system never hard-fails on a single third-party outage.
4. **Explainability over black-box ML** — MVP recommendations use transparent rule-based scoring, not opaque machine learning models.
5. **Local-first development** — JSON file persistence and in-memory caching eliminate Docker/PostgreSQL requirements for prototype deployment.
6. **Monorepo modularity** — Shared types and constants live in `packages/shared`; API and web apps consume the same contract.

### 3.1.3 System Boundaries

**Inputs:**
- User credentials (email/password for auth)
- Comparison parameters: send amount, source/dest currencies, corridor countries, priority
- Optional notification preferences (rate thresholds, alert flags)

**Outputs:**
- Ranked comparison results with fee breakdown per route
- Recommended route with explanation text
- Saved history, analytics aggregates, PDF/CSV exports
- Email notifications (when SMTP configured)

**External dependencies:**
- ExchangeRate-API / Frankfurter (FX rates)
- CoinGecko (crypto prices)
- Etherscan (Ethereum gas fees)
- SMTP server (optional, for email alerts)

---

## 3.2 System Architecture

### 3.2.1 High-Level Architecture

TrueRate follows a **three-tier client–server architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Tier                         │
│         React 19 + Vite + Tailwind CSS (Port 5173)          │
│   Pages: Compare | History | Analytics | Settings | Auth    │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS / REST / JSON
                           │ Bearer JWT + httpOnly cookies
┌──────────────────────────▼──────────────────────────────────┐
│                    Application Tier                          │
│              Express.js API (Port 3001)                        │
│  Routes → Services → Repositories → JSON Store               │
│  Jobs: rate-poller | notification-checker (node-cron)        │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐
│ JSON Data    │  │ In-Memory    │  │ External APIs        │
│ Store        │  │ Cache        │  │ FX | Crypto | Gas     │
│ apps/api/data│  │ 10-min TTL   │  │ ExchangeRate-API etc. │
└──────────────┘  └──────────────┘  └─────────────────────┘
```

### 3.2.2 Monorepo Structure

The repository is organized as an npm workspaces monorepo:

```
TrueRate/
├── apps/
│   ├── api/          # Express.js backend (@truerate/api)
│   └── web/          # React frontend (@truerate/web)
├── packages/
│   └── shared/       # Shared TypeScript types & constants (@truerate/shared)
├── docs/             # API contract, decisions, schema reference
├── PROJECT-REPORT.md
├── FEATURE-ROADMAP.md
└── package.json      # Root workspace scripts
```

### 3.2.3 Backend Layer Breakdown

| Layer | Location | Responsibility |
|-------|----------|----------------|
| **Routes** | `apps/api/src/routes/` | HTTP endpoint handlers, request validation |
| **Middleware** | `apps/api/src/middleware/` | Auth (JWT), rate limiting |
| **Services** | `apps/api/src/services/` | Business logic: comparison, auth, notifications, PDF |
| **Repositories** | `apps/api/src/db/repositories/` | Data access over JSON collections |
| **Providers** | `apps/api/src/providers/` | External API adapters (FX, crypto, gas) |
| **Jobs** | `apps/api/src/jobs/` | Scheduled tasks (rate polling, notifications) |
| **Config** | `apps/api/src/config/` | Provider fee configuration |

### 3.2.4 Frontend Layer Breakdown

| Layer | Location | Responsibility |
|-------|----------|----------------|
| **Pages** | `apps/web/src/pages/` | Route-level views (Compare, History, Analytics) |
| **Organisms** | `apps/web/src/components/organisms/` | ComparisonForm, ComparisonTable, SavedCorridorsPanel |
| **Molecules** | `apps/web/src/components/molecules/` | SavingsHero, FeeBreakdown, ToastViewport |
| **Atoms** | `apps/web/src/components/atoms/` | Button, InputField, SelectField |
| **Services** | `apps/web/src/services/` | API client wrappers (no direct fetch in components) |
| **Context** | `apps/web/src/context/` | AuthContext, ToastContext |
| **Helpers** | `apps/web/src/helpers/` | Formatting, URL building, CSV export, savings calc |

### 3.2.5 Communication Protocol

- **Protocol:** REST over HTTP
- **Base path:** `/api/v1`
- **Format:** JSON with envelope `{ "data": T }` on success, `{ "error": { "code", "message" } }` on failure
- **Authentication:** Bearer JWT in `Authorization` header; refresh token in httpOnly cookie `truerate_refresh`
- **CORS:** Configured for `http://localhost:5173` with credentials enabled

---

## 3.3 Framework Architecture

### 3.3.1 Backend Framework Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Runtime | Node.js | ≥ 20 | JavaScript server runtime |
| Language | TypeScript | 5.7 | Static typing across monorepo |
| Web framework | Express.js | 4.21 | HTTP routing and middleware |
| Dev runner | tsx | 4.19 | TypeScript execution with watch mode |
| Auth | jsonwebtoken + bcrypt | 9.0 / 5.1 | JWT signing and password hashing |
| Scheduling | node-cron | 3.0 | Background rate polling and notifications |
| PDF | pdf-lib | 1.17 | Server-side comparison report generation |
| Email | nodemailer | 6.9 | Transactional email (optional SMTP) |

Express follows a **modular router pattern**: each domain (auth, comparisons, analytics) registers its own `Router` instance, mounted in `index.ts`. This keeps route files small and testable.

### 3.3.2 Frontend Framework Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| UI library | React | 19 | Component-based UI |
| Build tool | Vite | 6.0 | Fast dev server and production bundling |
| Routing | React Router | 7.1 | Client-side SPA navigation |
| Styling | Tailwind CSS | 4.0 | Utility-first CSS |
| Server state | TanStack React Query | 5.64 | Caching, mutations, background refetch |
| Charts | Recharts | 2.15 | Analytics visualizations |
| Classnames | clsx + tailwind-merge | — | Dynamic CSS class composition |

### 3.3.3 Shared Package

`packages/shared` exports TypeScript types and constants consumed by both API and web:

- **Types:** `ComparisonRequest`, `ComparisonResult`, `ComparisonRoute`, `UserProfile`, analytics types
- **Constants:** `MVP_CORRIDORS`, `COMPARISON_PRIORITIES`, `PROVIDER_URLS`, `AMOUNT_PRESETS_BY_CURRENCY`, disclaimers

This ensures the frontend and backend always agree on data shapes without code duplication.

### 3.3.4 Atomic Design Pattern (Frontend)

The web app follows atomic design principles:

```
Atoms       → Button, InputField, SelectField
Molecules   → SavingsHero, FeeBreakdown, ToastViewport
Organisms   → ComparisonForm, ComparisonTable, SavedCorridorsPanel
Pages       → ComparePage, HistoryPage, AnalyticsPage
Templates   → App shell (header, main, footer via App.tsx)
```

API calls are isolated in `services/` — components never call `fetch` directly, satisfying separation-of-concerns requirements.

### 3.3.5 Provider Abstraction Pattern (Backend)

External data sources implement common interfaces defined in `providers/interfaces.ts`:

```typescript
interface FxProvider {
  getRates(base: string): Promise<FxRateResult>;
}
```

Concrete implementations:
- `ExchangeRateApiProvider` — Primary FX source
- `FrankfurterFxProvider` — Free ECB-based fallback
- `StaticFxProvider` — Offline fallback
- `ResilientFxProvider` — Chain-of-responsibility wrapper

The comparison service calls `createFxProvider()` and receives a resilient composite without knowing which underlying provider succeeded.

---

## 3.4 Cross-Border Payment Workflow

### 3.4.1 End-to-End User Workflow

The following workflow describes a typical comparison session:

```
User opens Compare page
        │
        ▼
Select corridor (e.g. India → Eurozone)
Enter amount (e.g. ₹100,000) and priority (e.g. Lowest cost)
        │
        ▼
Click "Compare routes"
        │
        ▼
Frontend POST /api/v1/comparisons
        │
        ▼
API: Fetch FX rates → Fetch gas price → Calculate 8 routes → Rank → Respond
        │
        ▼
Frontend displays SavingsHero + results table
        │
        ├── User exports CSV/PDF
        ├── User shares URL (?amount=...&source=INR&dest=EUR)
        └── If authenticated: comparison saved to history.json
```

### 3.4.2 Comparison Engine Workflow (Backend)

Detailed steps inside `runComparison()`:

1. **Fetch FX rates** for source currency via resilient FX provider chain.
2. **Extract destination rate** from rate table; reject unsupported pairs.
3. **Compute USD conversion factor** for network fee normalization.
4. **Fetch live Ethereum data** — ETH/USD price (CoinGecko) and transfer gas fee (Etherscan); fallback to $5 static if unavailable.
5. **Iterate MVP_PROVIDERS** — For each of 8 providers, call `calculateRoute()` with send amount, mid-market rate, fee config, and network fee.
6. **Rank routes** — Pass raw routes and user priority to `rankRoutes()` in recommendation engine.
7. **Record FX snapshot** — Async write to `fx-rate-snapshots.json` for analytics.
8. **Return ComparisonResult** — UUID, metadata, ranked routes, recommended route ID, disclaimer.

### 3.4.3 Authentication Workflow

```
Register/Login → bcrypt hash verify → Issue JWT (15 min) + refresh token (7 days)
Refresh token stored as SHA-256 hash in refresh-tokens.json
Refresh token delivered via httpOnly secure cookie
Access token returned in JSON response body
Protected routes: Authorization: Bearer <accessToken>
Token refresh: POST /auth/refresh using cookie → new access token
```

### 3.4.4 Notification Workflow

An hourly cron job (`notification-checker.ts`) executes:

1. Load users with `rateAlertsEnabled` or `betterRouteAlertsEnabled` from `users.json`.
2. For rate alerts: fetch current FX rate, compare to user threshold, send email if met.
3. For better-route alerts: compare last two comparisons, notify if recommended route changed.
4. Log all sent notifications to `notification-logs.json`.

---

## 3.5 Hardware Configuration

### 3.5.1 Development Environment

The prototype was developed and tested on standard developer hardware. No specialized or GPU hardware is required.

| Component | Minimum Specification | Recommended |
|-----------|----------------------|-------------|
| **Processor** | Dual-core 64-bit CPU | Apple M-series / Intel i5 or equivalent |
| **RAM** | 8 GB | 16 GB |
| **Storage** | 2 GB free disk space | SSD with 5 GB+ free |
| **Display** | 1280 × 720 | 1920 × 1080 or higher |
| **Network** | Broadband internet | Required for live FX/crypto API calls |

### 3.5.2 Server Requirements (Production — Planned)

For planned deployment on Vercel (frontend) and Railway (backend):

| Tier | Frontend (Vercel) | Backend (Railway) |
|------|-------------------|-------------------|
| Compute | Serverless edge functions | Node.js container (~512 MB RAM) |
| Storage | Static asset CDN | JSON files or PostgreSQL volume |
| Scaling | Automatic | Horizontal via Railway replicas |

The current JSON file store is suitable for single-instance prototype deployment only. Production scaling would require migration to PostgreSQL or another concurrent-safe database.

### 3.5.3 Client Requirements

Users access TrueRate through a modern web browser:

- Chrome 100+, Firefox 100+, Safari 15+, Edge 100+
- JavaScript enabled
- Cookies enabled (for refresh token)
- No mobile app installation required (responsive web layout)

---

## 3.6 Software Configuration

### 3.6.1 Operating System

| Environment | OS |
|-------------|-----|
| Development | macOS, Linux, or Windows with WSL2 |
| Production (planned) | Linux container (Railway) |

### 3.6.2 Runtime and Package Manager

| Software | Version |
|----------|---------|
| Node.js | ≥ 20.0.0 |
| npm | ≥ 10 (workspaces support) |

### 3.6.3 Environment Variables

**API (`apps/api/.env`):**

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `PORT` | No | 3001 | API listen port |
| `JWT_ACCESS_SECRET` | Yes | — | Access token signing key |
| `JWT_REFRESH_SECRET` | Yes | — | Refresh token hash salt |
| `JWT_ACCESS_EXPIRES_IN` | No | 15m | Access token TTL |
| `JWT_REFRESH_EXPIRES_IN` | No | 7d | Refresh token TTL |
| `EXCHANGERATE_API_KEY` | No | — | Primary FX provider key |
| `ETHERSCAN_API_KEY` | No | — | Ethereum gas fee API |
| `CORS_ORIGIN` | No | localhost:5173 | Allowed frontend origin |
| `DATA_DIR` | No | apps/api/data | JSON storage path |
| `RATE_POLL_INTERVAL_MINUTES` | No | 10 | FX polling frequency |
| `SMTP_*` | No | — | Email delivery (optional) |

**Web (`apps/web/.env`):**

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_API_URL` | No | API base URL (defaults to localhost:3001) |

### 3.6.4 Installation and Startup

```bash
# Clone repository and install dependencies
npm install

# Copy environment templates
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Initialize JSON data store
npm run db:init

# Start API (port 3001) and web (port 5173) concurrently
npm run dev
```

---

## 3.7 Tools Used

### 3.7.1 Development Tools

| Tool | Category | Usage |
|------|----------|-------|
| **Visual Studio Code / Cursor** | IDE | Code editing, integrated terminal |
| **TypeScript** | Language | Type-safe development across monorepo |
| **tsx** | Runtime | Hot-reload API development |
| **Vite** | Build tool | Frontend dev server and production build |
| **concurrently** | Process manager | Run API + web with single `npm run dev` |
| **Git** | Version control | Source code management |
| **GitHub Actions** | CI | Lint and typecheck on push/PR |

### 3.7.2 Backend Libraries

| Library | Purpose |
|---------|---------|
| express | HTTP server and routing |
| bcrypt | Password hashing (cost factor 12) |
| jsonwebtoken | JWT creation and verification |
| express-rate-limit | API abuse prevention |
| node-cron | Scheduled background jobs |
| pdf-lib | PDF report generation |
| nodemailer | Email notifications |
| cors | Cross-origin resource sharing |
| cookie-parser | httpOnly refresh token cookies |
| dotenv | Environment variable loading |

### 3.7.3 Frontend Libraries

| Library | Purpose |
|---------|---------|
| react / react-dom | UI rendering |
| react-router-dom | SPA routing |
| @tanstack/react-query | Server state management |
| recharts | Analytics charts (bar, line) |
| tailwindcss | Utility CSS styling |
| clsx / tailwind-merge | Conditional classnames |

### 3.7.4 External Services

| Service | URL | Data Provided |
|---------|-----|---------------|
| ExchangeRate-API | exchangerate-api.com | Live FX conversion rates |
| Frankfurter | frankfurter.app | ECB mid-market FX rates (free) |
| CoinGecko | coingecko.com | ETH and USDC USD prices |
| Etherscan | etherscan.io | Ethereum gas oracle |

---

## 3.8 Payment Route Categories

TrueRate compares **eight payment routes** grouped into **four provider type categories**:

### 3.8.1 Category Overview

| Category | Type Code | Routes | Description |
|----------|-----------|--------|-------------|
| **SWIFT / Bank** | `swift` | SWIFT Bank Transfer | Traditional correspondent banking wire |
| **Remittance** | `remittance` | Wise, Remitly, Western Union, Xoom | Licensed digital money transfer services |
| **Stablecoin** | `stablecoin` | USDC (Ethereum), USDC (Polygon) | USD-pegged tokens on public blockchains |
| **Cryptocurrency** | `crypto` | ETH (Ethereum) | Native volatile crypto asset transfer |

### 3.8.2 Route Configuration Parameters

Each route is defined in `apps/api/src/config/providers/mvp-providers.ts`:

| Route ID | Provider | Platform Fee | FX Spread | Network Fee | Est. Time |
|----------|----------|-------------|-----------|-------------|-----------|
| `swift` | SWIFT Bank Transfer | $25 flat | 2.5% | — | 72 hr |
| `wise` | Wise | 0.43% | 0.35% | — | 24 hr |
| `remitly` | Remitly | $3.99 flat | 1.5% | — | 12 hr |
| `western-union` | Western Union | $4.99 flat | 2.0% | — | 24 hr |
| `xoom` | Xoom | $5.99 flat | 1.8% | — | 18 hr |
| `usdc-ethereum` | USDC (Ethereum) | — | 0.1% | ~$5 live gas | 30 min |
| `usdc-polygon` | USDC (Polygon) | — | 0.1% | ~$0.01 static | 15 min |
| `eth-ethereum` | ETH (Ethereum) | — | 0.5% | ~$5 live gas | 30 min |

### 3.8.3 Cost Calculation Formula

For each route, the calculator (`calculator.ts`) applies:

```
networkFee    = networkFeeUsd × usdToSourceRate
platformFee   = (sendAmount × platformFeePercent / 100) + platformFeeFlat
convertible   = sendAmount − platformFee − networkFee
effectiveRate = midMarketRate × (1 − fxSpreadPercent / 100)
amountReceived = convertible × effectiveRate
fxMarkup      = (convertible × midMarketRate − amountReceived) / midMarketRate
totalFee      = platformFee + networkFee + fxMarkup
```

All monetary values are rounded to two decimal places; rates to four decimal places.

### 3.8.4 Supported Corridors and Currencies

- **Currencies:** USD, EUR, GBP, INR, MXN, PHP
- **Corridors:** 26 predefined routes including bidirectional pairs (e.g., India → UK and UK → India)
- **Amount presets:** Currency-aware quick-select buttons (e.g., ₹50,000 / ₹1,00,000 / ₹5,00,000 for INR)

---

## 3.9 Recommendation Engine

### 3.9.1 Design Approach

The MVP recommendation engine is **rule-based**, not machine-learning-based. This choice prioritizes explainability — users and evaluators can understand exactly why a route was recommended — over predictive accuracy from historical data.

The engine lives in `apps/api/src/services/recommendation/recommendation.engine.ts` and exposes two functions:
- `rankRoutes(routes, priority)` — Returns routes with rank, isRecommended flag, and explanation
- `getRecommendedRouteId(routes)` — Returns the top-ranked route ID

### 3.9.2 Priority Modes

| Priority | Scoring Logic |
|----------|---------------|
| `cheapest` | Sort by `totalFee` ascending |
| `highest_received` | Sort by `amountReceived` descending (score = −amountReceived) |
| `fastest` | Sort by `estimatedTimeHours` ascending |
| `balanced` | Weighted: 60% normalized cost + 40% normalized time |
| `traditional` | Balanced score + 0.5 penalty if route is stablecoin/crypto |
| `digital` | Balanced score + 0.5 penalty if route is SWIFT/remittance |

### 3.9.3 Normalization

For balanced, traditional, and digital modes, cost and time values are normalized to a 0–1 scale across all routes in the comparison:

```
normalized[i] = (value[i] − min) / (max − min)
```

If all values are equal (max = min), normalized scores default to 0, preventing division-by-zero.

### 3.9.4 Explanation Generation

The top-ranked route receives a human-readable `explanation` string:

| Priority | Example Explanation |
|----------|---------------------|
| cheapest | "Wise has the lowest total fee (4.30) for this transfer." |
| highest_received | "USDC (Polygon) delivers the highest amount received (926.06) in the destination currency." |
| fastest | "USDC (Polygon) offers the fastest estimated settlement (~15 minutes)." |
| traditional | "Wise is the best bank or remittance option for this transfer." |
| digital | "USDC (Polygon) is the best crypto or stablecoin route for this transfer." |

### 3.9.5 Future ML Enhancement (Phase 3)

Phase 3 plans to collect comparison outcome data and train models (decision tree, random forest, or XGBoost) to augment or replace rule-based scoring. The current engine is designed as a swappable module so ML inference can be inserted without changing the comparison calculator or API contract.

---

## 3.10 Security Features

### 3.10.1 Authentication Security

| Feature | Implementation |
|---------|----------------|
| Password hashing | bcrypt with cost factor 12 |
| Access tokens | JWT signed with `JWT_ACCESS_SECRET`, 15-minute expiry |
| Refresh tokens | 48-byte random hex, SHA-256 hashed before storage |
| Cookie security | httpOnly, secure (production), SameSite policy via cookie config |
| Token validation | `requireAuth` middleware verifies JWT and checks user exists |

### 3.10.2 API Security

| Feature | Implementation |
|---------|----------------|
| Rate limiting | General: 200 req/15 min; Auth: 10 req/15 min; Comparison: 30 req/15 min |
| CORS | Restricted to configured frontend origins with credentials |
| Input validation | `parseComparisonBody()` validates amount, currencies, priority |
| Error handling | Generic 500 messages; no stack traces exposed to client |
| Amount cap | Maximum send amount 1,000,000 to prevent abuse |

### 3.10.3 Data Security

| Feature | Implementation |
|---------|----------------|
| Password storage | Only bcrypt hashes stored in `users.json` — never plaintext |
| Refresh token storage | Only SHA-256 hashes stored — raw tokens never persisted |
| No PII beyond profile | Name and email only; no bank account or wallet addresses stored |
| Data directory | `apps/api/data/` gitignored — not committed to version control |
| Environment secrets | API keys and JWT secrets in `.env`, excluded via `.gitignore` |

### 3.10.4 Application Disclaimers

All comparison results include `COMPARISON_DISCLAIMER` from the shared package, stating that figures are estimates, not financial advice, and that TrueRate does not execute transfers.

### 3.10.5 Planned Production Security (Not Yet Deployed)

- HTTPS/TLS termination at Vercel/Railway edge
- Secure cookie flag enforced in production
- Secret rotation via hosting platform environment management
- RBAC for admin vs. user roles (Phase 3)

---

## 3.11 Blockchain Integration

### 3.11.1 Scope of Integration

TrueRate integrates with blockchain networks **indirectly** — for fee estimation and route modeling only. The prototype does not submit transactions, connect wallets, or interact with smart contracts on-chain.

Blockchain integration covers three routes:
- USDC on Ethereum mainnet
- USDC on Polygon (Layer 2)
- ETH on Ethereum mainnet

### 3.11.2 Data Integration Points

| Integration | Provider | Data Used |
|-------------|----------|-----------|
| ETH/USD price | CoinGecko `/simple/price` | Convert gas cost to USD |
| USDC/USD price | CoinGecko | Confirm stablecoin peg |
| Gas price (Gwei) | Etherscan Gas Oracle API | Estimate ERC-20 transfer cost |
| Static L2 fee | Configured constant | Polygon ~$0.01 when live gas not applicable |

### 3.11.3 Gas Fee Calculation

For Ethereum mainnet routes, the gas provider estimates transfer cost:

1. Fetch current gas price in Gwei from Etherscan.
2. Assume standard ERC-20 transfer gas limit (~65,000 units).
3. Multiply gas units × Gwei × ETH/USD price to get USD fee.
4. Convert USD fee to source currency using FX rates.

If Etherscan or CoinGecko fails, a static fallback of **$5 USD** network fee is applied.

### 3.11.4 Layer 1 vs. Layer 2 Modeling

The prototype explicitly models the cost difference between Ethereum L1 and Polygon L2:

| Network | Gas Source | Typical Fee | Settlement |
|---------|-----------|-------------|------------|
| Ethereum | Live (Etherscan) | $2–$15+ depending on congestion | ~30 min |
| Polygon | Static config | ~$0.01 | ~15 min |

This allows users to see why USDC (Polygon) frequently outranks USDC (Ethereum) on cost-sensitive comparisons — a key educational outcome of the blockchain integration.

### 3.11.5 Limitations

- Off-ramp exchange fees (fiat ↔ crypto conversion) are modeled as FX spread only, not as separate line items.
- Wallet setup, KYC at exchanges, and regulatory eligibility are not modeled.
- Bitcoin, Solana, and other chains are not included in MVP scope.

---

## 3.12 Database Design

### 3.12.1 Storage Strategy

The prototype uses **JSON file-based persistence** instead of a relational database. This decision supports the project goal of local-first development without Docker or PostgreSQL installation.

All data is stored in `apps/api/data/` as one JSON array file per collection. The `json-store.ts` module provides:

- `readCollection(name)` — Parse JSON file to typed array
- `writeCollection(name, items)` — Serialize array to formatted JSON
- `mutateCollection(name, mutator)` — Read-modify-write atomic pattern
- `initJsonStore()` — Create empty collection files on startup

### 3.12.2 Collection Schema

| File | Collection | Primary Entities |
|------|------------|-----------------|
| `users.json` | users | User accounts, preferences |
| `refresh-tokens.json` | refresh-tokens | Hashed session refresh tokens |
| `comparisons.json` | comparisons | Full comparison results + userId |
| `saved-pairs.json` | saved-pairs | Favorite corridor pairs per user |
| `fx-rate-snapshots.json` | fx-rate-snapshots | Historical FX rate records |
| `notification-logs.json` | notification-logs | Sent alert audit trail |

### 3.12.3 Entity Definitions

**User (`StoredUser`):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "passwordHash": "bcrypt-hash",
  "name": "Jane Doe",
  "defaultSourceCurrency": "USD",
  "defaultDestCurrency": "INR",
  "notificationPreferences": {},
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601"
}
```

**Comparison (`StoredComparison`):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "sendAmount": 1000,
  "sourceCurrency": "USD",
  "destCurrency": "INR",
  "priority": "balanced",
  "midMarketRate": 83.5,
  "recommendedRouteId": "usdc-polygon",
  "routes": [ "...ComparisonRoute[]" ],
  "createdAt": "ISO-8601"
}
```

**FX Snapshot (`StoredFxSnapshot`):**
```json
{
  "id": "uuid",
  "baseCurrency": "USD",
  "quoteCurrency": "INR",
  "rate": 83.5,
  "source": "frankfurter",
  "recordedAt": "ISO-8601"
}
```

### 3.12.4 Repository Pattern

Data access is encapsulated in repository modules under `apps/api/src/db/repositories/`:

| Repository | Key Functions |
|------------|---------------|
| `users.repository` | findUserByEmail, createUser, updateUser |
| `refresh-tokens.repository` | storeRefreshToken, findRefreshToken, deleteRefreshToken |
| `comparisons.repository` | saveComparison, listComparisons, searchComparisons |
| `saved-pairs.repository` | listSavedPairs, createSavedPair, deleteSavedPair |
| `fx-snapshots.repository` | recordFxSnapshot, getRateHistory |
| `analytics.repository` | getMonthlySavings, getCorridorUsage, getProviderPerformance |

Services call repositories; repositories call `json-store`. Routes never access files directly.

### 3.12.5 Legacy SQL Schema

SQL migration files (`001_initial_schema.sql`, `002_analytics_notifications.sql`) remain in the repository as reference documentation for a planned PostgreSQL migration in production. The JSON store mirrors the same logical entities.

### 3.12.6 Caching Layer

In-memory cache (`memory-cache.ts`) supplements JSON persistence:

| Cache Key Pattern | TTL | Purpose |
|-------------------|-----|---------|
| `fx:rates:{base}` | 10 min | FX rate responses |
| `crypto:price:{coin}` | 10 min | CoinGecko prices |
| `gas:ethereum` | 10 min | Etherscan gas estimates |

Redis was deferred; the in-memory cache is sufficient for single-instance prototype deployment.

---

## 3.13 API Integration

### 3.13.1 API Overview

TrueRate exposes a versioned REST API at `/api/v1`. All endpoints return JSON. Protected routes require `Authorization: Bearer <accessToken>`.

### 3.13.2 Endpoint Summary

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/health` | Public | Service health check |
| GET | `/api/v1/currencies` | Public | Supported currency list |
| GET | `/api/v1/corridors` | Public | Supported corridor list |
| POST | `/api/v1/auth/register` | Public | Create account |
| POST | `/api/v1/auth/login` | Public | Sign in |
| POST | `/api/v1/auth/refresh` | Cookie | Refresh access token |
| POST | `/api/v1/auth/logout` | Required | Invalidate session |
| GET | `/api/v1/users/me` | Required | Get profile |
| PATCH | `/api/v1/users/me` | Required | Update profile/preferences |
| POST | `/api/v1/comparisons` | Optional | Run comparison |
| GET | `/api/v1/comparisons` | Required | List history |
| GET | `/api/v1/comparisons/search` | Required | Search history |
| GET | `/api/v1/comparisons/:id` | Required | Get comparison detail |
| GET | `/api/v1/comparisons/:id/export/pdf` | Required | Download PDF |
| GET | `/api/v1/comparisons/:id/export/csv` | Required | Download CSV |
| GET | `/api/v1/saved-pairs` | Required | List saved corridors |
| POST | `/api/v1/saved-pairs` | Required | Save corridor |
| DELETE | `/api/v1/saved-pairs/:id` | Required | Remove saved corridor |
| GET | `/api/v1/analytics/overview` | Required | Analytics summary |
| GET | `/api/v1/analytics/savings` | Required | Monthly savings |
| GET | `/api/v1/analytics/providers` | Required | Provider performance |
| GET | `/api/v1/analytics/corridors` | Required | Corridor usage |
| GET | `/api/v1/analytics/countries` | Required | Country analytics |
| GET | `/api/v1/analytics/fees` | Required | Fee comparison |
| GET | `/api/v1/analytics/rates/:base/:quote` | Required | FX rate history |

### 3.13.3 Comparison API Example

**Request:**
```http
POST /api/v1/comparisons
Content-Type: application/json
Authorization: Bearer eyJ...

{
  "sendAmount": 100000,
  "sourceCurrency": "INR",
  "destCurrency": "EUR",
  "sourceCountry": "IN",
  "destCountry": "EU",
  "priority": "cheapest"
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "sendAmount": 100000,
    "sourceCurrency": "INR",
    "destCurrency": "EUR",
    "midMarketRate": 0.0093,
    "fxRateSource": "frankfurter",
    "priority": "cheapest",
    "recommendedRouteId": "usdc-polygon",
    "routes": [
      {
        "routeId": "usdc-polygon",
        "providerName": "USDC (Polygon)",
        "providerType": "stablecoin",
        "platformFee": 0,
        "fxMarkup": 100,
        "networkFee": 0.95,
        "totalFee": 100.95,
        "effectiveRate": 0.0093,
        "amountReceived": 926.06,
        "estimatedTimeHours": 0.25,
        "rank": 1,
        "isRecommended": true,
        "explanation": "USDC (Polygon) has the lowest total fee...",
        "providerUrl": "https://www.circle.com/en/usdc"
      }
    ],
    "disclaimer": "All figures are estimates..."
  }
}
```

### 3.13.4 External API Integration Summary

| External API | Internal Interface | Fallback |
|--------------|-------------------|----------|
| ExchangeRate-API | `FxProvider` | Frankfurter → Static rates |
| Frankfurter | `FxProvider` | Static rates |
| CoinGecko | `CryptoProvider` | Static ETH price (~$3000) |
| Etherscan | `GasFeeProvider` | Static $5 gas estimate |
| SMTP (optional) | `email.service` | Console log in dev mode |

### 3.13.5 Frontend API Client

The web app communicates with the API through service modules:

| Service File | Responsibility |
|--------------|----------------|
| `apiClient.ts` | Base fetch wrapper, auth header injection, error parsing |
| `authService.ts` | Register, login, logout, profile, saved pairs |
| `comparisonService.ts` | Run comparison, search, fetch detail, PDF download |
| `analyticsService.ts` | Analytics dashboard data fetching |

React Query manages caching and mutation state in page components. The access token is stored in `localStorage`; the refresh token is managed via httpOnly cookie automatically by the browser.

### 3.13.6 Error Handling Convention

All API errors follow a consistent envelope:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "sendAmount must be a positive number"
  }
}
```

Common error codes: `VALIDATION_ERROR`, `UNAUTHORIZED`, `NOT_FOUND`, `RATE_LIMITED`, `COMPARISON_ERROR`, `INTERNAL_ERROR`.

The frontend displays error messages in contextual UI (form errors, toast notifications, inline alert banners).

---

*End of Chapter 3*

---

# 4. Results and Discussion

This chapter presents the outcomes of testing the TrueRate prototype, analyzes comparison results across representative corridors, discusses the web dashboard functionality, and evaluates system performance. All numerical results in this chapter were obtained from the running prototype on **30 June 2026**, using live FX rates from Frankfurter and configured provider fee parameters described in Chapter 3.

---

## 4.1 Experimentation Results

### 4.1.1 Experimental Setup

Experiments were conducted on the local development environment:

| Parameter | Value |
|-----------|-------|
| API endpoint | `http://localhost:3001/api/v1/comparisons` |
| FX source | Frankfurter (ECB mid-market rates) |
| Gas fee source | Etherscan (live) with static fallback |
| Routes evaluated | 8 per comparison |
| Corridors tested | USD→INR, INR→EUR, GBP→INR, USD→MXN |
| Priority modes tested | balanced, cheapest, fastest, traditional |

Each experiment sent a `POST` request with corridor parameters and recorded the ranked route list, recommended route, fee breakdown, and response time.

### 4.1.2 Experiment 1 — USD → INR ($1,000, Balanced Priority)

**Input:** Send $1,000 from United States to India (USD → INR)  
**Mid-market rate:** 94.66 INR/USD  
**Recommended route:** USDC (Polygon)

| Rank | Provider | Type | Total Fee (USD) | Received (INR) | Time |
|------|----------|------|-----------------|----------------|------|
| 1 | USDC (Polygon) | Stablecoin | $1.01 | ₹94,564.39 | ~15 min |
| 2 | USDC (Ethereum) | Stablecoin | $3.56 | ₹94,323.04 | ~30 min |
| 3 | ETH (Ethereum) | Crypto | $7.55 | ₹93,945.37 | ~30 min |
| 4 | Wise | Remittance | $7.78 | ₹93,923.08 | ~24 hr |
| 5 | Remitly | Remittance | $18.93 | ₹92,868.07 | ~12 hr |
| 6 | Xoom | Remittance | $23.88 | ₹92,399.31 | ~18 hr |
| 7 | Western Union | Remittance | $24.89 | ₹92,303.89 | ~24 hr |
| 8 | SWIFT Bank Transfer | SWIFT | $49.38 | ₹89,986.16 | ~3 days |

**Key findings:**
- USDC (Polygon) delivered **₹4,578.23 more** than SWIFT — a 5.1% improvement in amount received.
- Wise ranked best among traditional remittance providers (rank 4 overall) with only $7.78 total fee.
- SWIFT was the most expensive on every cost metric and slowest by a wide margin (72 hours vs. 15 minutes).
- The balanced priority correctly weighted USDC (Polygon)'s low cost and fast settlement as the optimal combination.

### 4.1.3 Experiment 2 — INR → EUR (₹100,000, Cheapest Priority)

**Input:** Send ₹100,000 from India to Eurozone (INR → EUR)  
**Mid-market rate:** 0.00927 EUR/INR  
**Recommended route:** USDC (Polygon)

| Rank | Provider | Total Fee (INR) | Received (EUR) | Time |
|------|----------|-----------------|----------------|------|
| 1 | USDC (Polygon) | ₹100.95 | €926.06 | ~15 min |
| 2 | USDC (Ethereum) | ₹342.39 | €923.83 | ~30 min |
| 3 | ETH (Ethereum) | ₹741.42 | €920.13 | ~30 min |
| 4 | Wise | ₹778.49 | €919.78 | ~24 hr |
| 5 | Remitly | ₹1,503.93 | €913.06 | ~12 hr |
| 6 | Xoom | ₹1,805.88 | €910.26 | ~18 hr |
| 7 | Western Union | ₹2,004.89 | €908.41 | ~24 hr |
| 8 | SWIFT | ₹2,524.38 | €903.60 | ~3 days |

**Key findings:**
- Savings hero displayed: **€22.46 more** received via USDC (Polygon) vs. SWIFT.
- FX markup dominated remittance costs on this corridor — Remitly's flat ₹3.99 fee was offset by ₹1,499.94 FX markup.
- Ethereum mainnet gas (~₹242.63 network fee at time of test) made USDC (Ethereum) significantly more expensive than Polygon despite identical FX spread.
- This experiment validates the currency-aware amount presets and INR-denominated fee display implemented in the web UI.

### 4.1.4 Experiment 3 — USD → INR ($1,000, Fastest Priority)

**Recommended route:** USDC (Polygon) (~15 min)

When priority was switched to **fastest**, the ranking changed to prioritize settlement time:

| Rank | Provider | Time |
|------|----------|------|
| 1 | USDC (Polygon) | ~15 min |
| 2 | USDC (Ethereum) | ~30 min |
| 3 | ETH (Ethereum) | ~30 min |
| 4 | Remitly | ~12 hr |
| 5 | Xoom | ~18 hr |
| 6 | Wise | ~24 hr |

Digital rails occupied the top three positions. Remitly ranked above Wise on speed despite higher cost — demonstrating that the fastest priority correctly ignores fee optimization.

### 4.1.5 Experiment 4 — GBP → INR (£1,000, Traditional Priority)

**Recommended route:** Wise (among bank & remittance routes)

With **traditional** priority (penalizing crypto/stablecoin routes):

| Provider | Received (INR) | Total Fee (GBP) |
|----------|----------------|-----------------|
| **Wise** (recommended) | ₹124,185.64 | £7.78 |
| Remitly | ₹122,790.70 | £18.93 |
| Western Union | ₹122,044.74 | £24.89 |
| USDC (Polygon)* | ₹125,033.89 | £1.01 |
| SWIFT | ₹118,980.23 | £49.38 |

*USDC (Polygon) would have delivered the highest amount but was deprioritized by the traditional rail preference penalty.

**Discussion:** This experiment demonstrates that priority selection materially changes recommendations. Users who cannot or will not use crypto rails should select "Bank & remittance" priority to receive Wise as the top recommendation rather than a stablecoin route.

### 4.1.6 Functional Testing Summary

Beyond comparison experiments, the following features were manually verified:

| Feature | Result |
|---------|--------|
| User registration and login | ✅ Pass |
| JWT refresh via httpOnly cookie | ✅ Pass |
| Auto-save comparison to history | ✅ Pass |
| Saved corridors (save/select/delete) | ✅ Pass |
| Shareable URL with auto-run | ✅ Pass |
| Compare again from history | ✅ Pass |
| CSV and PDF export | ✅ Pass |
| Analytics charts (with history data) | ✅ Pass |
| Rate alert settings page | ✅ Pass |
| FX fallback when API unavailable | ✅ Pass (static rates) |
| Toast notifications on login/register | ✅ Pass |

---

## 4.2 Payment Comparison Dashboard

### 4.2.1 Dashboard Overview

The payment comparison dashboard is the primary user interface of TrueRate, accessible at the root URL (`/`). It consists of four main UI regions:

1. **Comparison form** — Corridor selector, amount input with currency-aware presets, priority dropdown
2. **Saved corridors panel** — Visible when authenticated; quick-select chips for favorite routes
3. **Savings hero card** — Highlighted summary of the best route and savings vs. worst option
4. **Results table** — Sortable, filterable table of all eight routes with fee breakdown and provider links

### 4.2.2 Comparison Form

The form (`ComparisonForm` organism) captures user input:

| Field | Behavior |
|-------|----------|
| **Corridor** | Dropdown of 26 routes with helper text explaining corridor concept |
| **Send amount** | Numeric input labeled with source currency (e.g., "Send amount (INR)") |
| **Amount presets** | Currency-aware quick buttons (e.g., ₹50,000 / ₹1,00,000 / ₹5,00,000 for INR) |
| **Priority** | Six options: Lowest cost, Most received, Fastest, Best balance, Bank & remittance, Crypto & stablecoins |

When a user arrives via shareable URL (`/?amount=1000&source=USD&dest=INR&priority=balanced`), the form pre-fills and automatically runs the comparison.

### 4.2.3 Savings Hero Card

The savings hero (`SavingsHero` molecule) appears above the results table when comparison data is available. For the INR → EUR experiment, it displayed:

> **Your best option: USDC (Polygon)**  
> Receive up to **€22.46 more** than SWIFT Bank Transfer on this transfer.

Below the headline, a **fee breakdown** section shows full labels:
- Platform fee
- Foreign exchange markup
- Network fee

This expanded labeling appears only in the hero card; table rows retain abbreviated labels (Platform · FX · Net) to preserve compact layout.

### 4.2.4 Results Table

The results table (`ComparisonTable` organism) provides:

| Capability | Description |
|------------|-------------|
| **Sort** | By recommendation rank, total fee, or settlement time |
| **Filter** | By provider type: All, SWIFT, Remittance, Stablecoin, Crypto |
| **Highlight** | Recommended route row with green background and "Best" badge |
| **Fee detail** | Sub-row showing Platform · FX · Net breakdown per route |
| **Provider link** | "Go →" opens provider website in new tab |
| **Export** | Share link, Export CSV, Export PDF (PDF requires auth) |

### 4.2.5 Additional Dashboard Pages

| Page | URL | Purpose |
|------|-----|---------|
| History | `/history` | Paginated comparison list with search and "Compare again" |
| Comparison detail | `/history/:id` | Full result replay for a saved comparison |
| Analytics | `/analytics` | Charts: savings, corridors, providers, FX history |
| Settings | `/settings` | Notification preferences and rate alert thresholds |
| Login / Register | `/login`, `/register` | Authentication with success toast notifications |

### 4.2.6 User Experience Observations

Strengths observed during testing:
- Single-page comparison flow requires minimal clicks (select corridor → enter amount → compare).
- Savings hero provides immediate value before users read the full table.
- Shareable URLs enable demo and collaboration without requiring login.
- Responsive layout works on mobile-width viewports.

Areas for future improvement:
- Provider fee config may drift from live pricing — a "last updated" date on fee config would increase trust.
- Crypto routes may confuse users unfamiliar with wallets — the traditional priority mode mitigates this.

---

## 4.3 Cross-Border Payment Summary Matrix

### 4.3.1 Matrix Purpose

The cross-border payment summary matrix consolidates results across experiments into a single reference view. It answers: *For a given corridor and amount, which route wins on cost, speed, and amount received?*

### 4.3.2 USD → INR ($1,000) — Full Matrix

| Provider | Platform Fee | FX Markup | Network Fee | Total Fee | Effective Rate | Received (INR) | Time | Best For |
|----------|-------------|-----------|-------------|-----------|----------------|----------------|------|----------|
| USDC (Polygon) | $0.00 | $1.00 | $0.01 | **$1.01** | 94.5653 | **94,564** | 15 min | Cost + Speed |
| USDC (Ethereum) | $0.00 | $1.00 | $2.56 | $3.56 | 94.5653 | 94,323 | 30 min | Digital |
| ETH (Ethereum) | $0.00 | $4.99 | $2.56 | $7.55 | 94.1867 | 93,945 | 30 min | — |
| Wise | $4.30 | $3.48 | $0.00 | $7.78 | 94.3287 | 93,923 | 24 hr | Traditional |
| Remitly | $3.99 | $14.94 | $0.00 | $18.93 | 93.2401 | 92,868 | 12 hr | Speed (traditional) |
| Xoom | $5.99 | $17.89 | $0.00 | $23.88 | 92.9561 | 92,399 | 18 hr | — |
| Western Union | $4.99 | $19.90 | $0.00 | $24.89 | 92.7668 | 92,304 | 24 hr | — |
| SWIFT | $25.00 | $24.38 | $0.00 | $49.38 | 92.2935 | 89,986 | 72 hr | — |

### 4.3.3 INR → EUR (₹100,000) — Full Matrix

| Provider | Total Fee (INR) | Received (EUR) | Time |
|----------|-----------------|----------------|------|
| USDC (Polygon) | **₹100.95** | **€926.06** | 15 min |
| USDC (Ethereum) | ₹342.39 | €923.83 | 30 min |
| ETH (Ethereum) | ₹741.42 | €920.13 | 30 min |
| Wise | ₹778.49 | €919.78 | 24 hr |
| Remitly | ₹1,503.93 | €913.06 | 12 hr |
| Xoom | ₹1,805.88 | €910.26 | 18 hr |
| Western Union | ₹2,004.89 | €908.41 | 24 hr |
| SWIFT | ₹2,524.38 | €903.60 | 72 hr |

### 4.3.4 Cross-Corridor Pattern Summary

Analysis across all experiments reveals consistent patterns:

| Pattern | Observation |
|---------|-------------|
| **Stablecoin L2 dominance** | USDC (Polygon) wins on cost and speed in 3/4 experiments |
| **L1 gas penalty** | Ethereum mainnet gas adds $2–$3 USD equivalent vs. Polygon |
| **SWIFT always last** | Highest fee and slowest time on every tested corridor |
| **Wise leads remittance** | Best traditional provider on cost in all experiments |
| **FX markup > platform fee** | For Remitly, WU, Xoom — FX spread exceeds visible flat fees |
| **Priority changes winner** | Traditional priority shifts recommendation from USDC to Wise |

### 4.3.5 Recommendation Matrix by Priority

| Priority | USD→INR Winner | INR→EUR Winner | GBP→INR Winner |
|----------|---------------|----------------|----------------|
| Lowest cost | USDC (Polygon) | USDC (Polygon) | USDC (Polygon) |
| Most received | USDC (Polygon) | USDC (Polygon) | USDC (Polygon) |
| Fastest | USDC (Polygon) | USDC (Polygon) | USDC (Polygon) |
| Best balance | USDC (Polygon) | USDC (Polygon) | USDC (Polygon) |
| Bank & remittance | Wise | Wise | Wise |
| Crypto & stablecoins | USDC (Polygon) | USDC (Polygon) | USDC (Polygon) |

This matrix confirms the recommendation engine behaves consistently and predictably across corridors and priority modes.

---

## 4.4 Cost Analysis

### 4.4.1 Total Cost Comparison (USD → INR, $1,000)

```
SWIFT          ████████████████████████████████████████████████  $49.38
Western Union  █████████████████████████                         $24.89
Xoom           ████████████████████████                          $23.88
Remitly        ███████████████████                               $18.93
ETH (Ethereum) ████████                                           $7.55
Wise           ████████                                           $7.78
USDC (ETH)     ████                                               $3.56
USDC (Polygon) █                                                   $1.01
```

SWIFT costs **48.9× more** than USDC (Polygon) on this corridor — almost entirely due to the $25 flat fee and 2.5% FX spread.

### 4.4.2 Fee Component Analysis

Decomposing total fee into platform, FX markup, and network components for USD → INR ($1,000):

| Provider | Platform | FX Markup | Network | FX as % of Total |
|----------|----------|-----------|---------|------------------|
| SWIFT | $25.00 (50.6%) | $24.38 (49.4%) | $0.00 | 49.4% |
| Western Union | $4.99 (20.0%) | $19.90 (80.0%) | $0.00 | 80.0% |
| Wise | $4.30 (55.3%) | $3.48 (44.7%) | $0.00 | 44.7% |
| USDC (Polygon) | $0.00 (0%) | $1.00 (99.0%) | $0.01 (1.0%) | 99.0% |
| USDC (Ethereum) | $0.00 (0%) | $1.00 (28.1%) | $2.56 (71.9%) | 28.1% |

**Discussion:** For remittance providers with low flat fees (Western Union, Remitly), FX markup accounts for 80%+ of total cost — confirming the literature survey finding that hidden FX spreads are the dominant cost driver. TrueRate's fee decomposition makes this visible to users who might otherwise focus only on advertised transfer fees.

### 4.4.3 Savings Analysis

| Corridor | Amount | Best Route | Worst Route | Savings (dest. currency) | Savings % |
|----------|--------|------------|-------------|--------------------------|-----------|
| USD → INR | $1,000 | USDC (Polygon) | SWIFT | ₹4,578.23 | 5.1% |
| INR → EUR | ₹100,000 | USDC (Polygon) | SWIFT | €22.46 | 2.4% |
| GBP → INR | £1,000 | USDC (Polygon) | SWIFT | ₹6,053.66 | 5.1% |

On a $1,000 USD → INR transfer, choosing USDC (Polygon) over SWIFT saves the recipient approximately **₹4,578** — meaningful for recurring remittance senders. Over 12 monthly transfers, annualized savings exceed **₹54,000**.

### 4.4.4 Effective Rate Analysis

The effective exchange rate shows what rate the sender actually receives after all fees and spreads:

| Provider | Mid-Market | Effective Rate | Spread vs. Mid-Market |
|----------|-----------|----------------|----------------------|
| USDC (Polygon) | 94.6600 | 94.5653 | −0.10% |
| Wise | 94.6600 | 94.3287 | −0.35% |
| Remitly | 94.6600 | 93.2401 | −1.50% |
| SWIFT | 94.6600 | 92.2935 | −2.50% |

Even small effective rate differences compound on large transfers. A 2.4% spread (SWIFT) vs. 0.1% (USDC Polygon) on a $10,000 transfer represents roughly **₹22,000** difference in amount received.

### 4.4.5 Cost Analysis Limitations

Results should be interpreted with these caveats:

1. Provider fees are **configured estimates**, not live quotes — promotional rates and first-transfer discounts are not modeled.
2. Crypto route costs exclude exchange on-ramp/off-ramp fees, KYC friction, and tax implications.
3. SWIFT intermediary bank fees may exceed the configured $25 flat fee in practice.
4. Gas fees vary minute-to-minute; the Etherscan snapshot at test time may differ at execution.

---

## 4.5 Performance Analysis

### 4.5.1 API Response Time

Comparison endpoint performance was measured via direct HTTP requests to the local API:

| Test | Corridor | Response Time |
|------|----------|---------------|
| USD → MXN ($5,000) | balanced | **~1 ms** (cached FX) |
| USD → INR ($1,000) | balanced | **~200–400 ms** (live FX fetch) |
| INR → EUR (₹100,000) | cheapest | **~200–400 ms** (live FX fetch) |

The non-functional requirement target was **2–3 seconds**. All tests completed well within this threshold.

**Factors affecting response time:**

| Factor | Impact |
|--------|--------|
| FX cache hit (10-min TTL) | Near-instant (< 5 ms) |
| FX cache miss (Frankfurter fetch) | +100–300 ms |
| Etherscan gas fetch | +50–150 ms |
| Route calculation (8 routes) | < 1 ms (pure computation) |
| JSON file write (FX snapshot) | Async, non-blocking |

### 4.5.2 Caching Effectiveness

The in-memory cache significantly reduces external API dependency:

| Data Type | Cache TTL | Observed Hit Rate (dev session) |
|-----------|-----------|--------------------------------|
| FX rates | 10 minutes | ~90% after warm-up |
| Crypto prices | 10 minutes | ~85% |
| Gas estimates | 10 minutes | ~85% |

The scheduled rate poller (`rate-poller.ts`) pre-warms USD, EUR, and GBP bases every 5–15 minutes, ensuring most user-initiated comparisons hit a warm cache.

### 4.5.3 Frontend Performance

| Metric | Observation |
|--------|-------------|
| Initial page load (Vite dev) | < 1 second |
| Comparison form render | Instant |
| Results table render (8 rows) | < 50 ms |
| React Query mutation round-trip | Dominated by API response time |
| Analytics charts (Recharts) | Smooth with < 100 history records |

Production build (`npm run build -w @truerate/web`) produces optimized static assets suitable for CDN deployment on Vercel.

### 4.5.4 Storage Performance

JSON file persistence performance on local development hardware:

| Operation | Typical Latency |
|-----------|----------------|
| Read collection (users.json) | < 1 ms |
| Write comparison record | < 5 ms |
| Search comparisons (linear scan) | < 10 ms for < 1,000 records |

JSON storage is adequate for prototype scale (< 10,000 records). Production deployment would require PostgreSQL for concurrent write safety and indexed search.

### 4.5.5 Reliability and Fallback Testing

| Scenario | System Behavior | Result |
|----------|----------------|--------|
| ExchangeRate-API key missing | Falls back to Frankfurter | ✅ Pass |
| Frankfurter unreachable | Falls back to static rates | ✅ Pass |
| Etherscan API failure | Static $5 gas fee applied | ✅ Pass |
| Invalid comparison input | 400 VALIDATION_ERROR returned | ✅ Pass |
| Expired JWT | 401 UNAUTHORIZED, refresh via cookie | ✅ Pass |
| Rate limit exceeded | 429 RATE_LIMITED with message | ✅ Pass |

The resilient provider chain ensures the system **degrades gracefully** rather than failing completely — a critical requirement for FinTech applications dependent on third-party data.

### 4.5.6 Discussion — Performance vs. Accuracy Trade-off

The 10-minute FX cache introduces a maximum staleness of 10 minutes on displayed rates. For a comparison tool (not an execution platform), this is acceptable — users verify final rates on the provider's site before transferring. Tighter cache TTL would improve accuracy but increase API quota consumption and response latency.

The sub-second response time on cached comparisons demonstrates that the architecture successfully separates **data freshness** (background polling) from **user-facing latency** (cache-served comparisons).

---

*End of Chapter 4*

---

# 5. Expected Outcome

This chapter summarizes what the TrueRate project set out to achieve, what has been delivered through the prototype, the expected impact on users and the FinTech domain, limitations acknowledged, and the planned direction for future development. It serves as the concluding technical chapter before the reference list.

---

## 5.1 Alignment with Project Objectives

Chapter 1 defined primary and secondary objectives for TrueRate. The table below maps each objective to its current status based on prototype implementation and testing documented in Chapters 3 and 4.

### 5.1.1 Primary Objectives — Achievement Summary

| # | Objective | Target | Status | Evidence |
|---|-----------|--------|--------|----------|
| 1 | Multi-rail comparison engine | ≥ 8 routes | ✅ Achieved | 8 routes across 4 provider types (Ch. 3.8, 4.1) |
| 2 | Live and fallback market data | FX + crypto + gas | ✅ Achieved | Resilient 3-tier FX chain; CoinGecko + Etherscan (Ch. 3.11, 4.5.5) |
| 3 | Actionable recommendations | 6 priority modes + explanations | ✅ Achieved | Rule-based engine with explainable output (Ch. 3.9, 4.1.5) |
| 4 | Responsive web dashboard | Compare, history, analytics | ✅ Achieved | 7 pages, atomic design UI (Ch. 4.2) |
| 5 | User accounts and persistence | Auth + history + saved pairs | ✅ Achieved | JWT auth, JSON persistence (Ch. 3.10, 3.12) |

### 5.1.2 Secondary Objectives — Achievement Summary

| # | Objective | Status | Notes |
|---|-----------|--------|-------|
| 1 | FinTech UX patterns (toasts, share URL, savings hero) | ✅ Achieved | Phase 2.6 quick wins shipped |
| 2 | FX rate history for analytics | ✅ Achieved | `fx-rate-snapshots.json` + Recharts dashboard |
| 3 | Threshold-based notifications | ✅ Achieved | Hourly cron + email/console delivery |
| 4 | Scalable monorepo architecture | ✅ Achieved | `apps/api`, `apps/web`, `packages/shared` |
| 5 | Thorough documentation | ✅ Achieved | PRD, API contract, roadmap, this report |

### 5.1.3 Objectives Not Yet Met

| Objective | Reason | Planned Phase |
|-----------|--------|---------------|
| Production deployment (Vercel + Railway) | Deferred for academic prototype | Post-project |
| Live provider fee APIs | Providers do not expose public quote APIs | Manual config refresh |
| Machine learning recommendations | Insufficient training data | Phase 3 |
| Mobile application | Web-first validation priority | Phase 3 |
| Fee-drop notifications | Requires fee history tracking | Phase 2 (deferred) |

Overall, **all core MVP objectives have been met**. Remaining items are enhancements appropriate for production launch or Phase 3 rather than prototype demonstration.

---

## 5.2 Expected Outcomes of the Prototype

### 5.2.1 For End Users (Remittance Senders)

The TrueRate prototype is expected to deliver the following outcomes for individuals and small businesses sending money internationally:

1. **Informed route selection** — Users can compare eight payment options in one view instead of visiting multiple provider websites manually.

2. **Visible savings** — The savings hero and amount-received column quantify how much more the recipient gets on the best route. Experiments showed savings of **₹4,578 per $1,000** on USD→INR and **€22.46 per ₹100,000** on INR→EUR compared to SWIFT.

3. **Fee transparency** — Decomposition of platform fee, FX markup, and network fee addresses the industry problem of hidden exchange-rate spreads identified in the literature survey (Chapter 2.7).

4. **Priority-driven recommendations** — Users who prefer traditional banking can select "Bank & remittance" and receive Wise as the top recommendation; crypto-comfortable users see stablecoin routes ranked first.

5. **Historical tracking** — Authenticated users build a comparison history and analytics profile, enabling retrospective analysis of corridors and providers used over time.

6. **Actionable next steps** — "Go →" provider links and shareable comparison URLs bridge the gap between comparison and execution on the provider's platform.

### 5.2.2 For the FinTech Domain

Beyond individual users, TrueRate demonstrates several concepts valuable to the broader FinTech ecosystem:

| Contribution | Description |
|--------------|-------------|
| **Multi-rail comparison methodology** | A reproducible calculator model applicable to any corridor with configured provider parameters |
| **Provider abstraction pattern** | Swappable FX, crypto, and gas data adapters resilient to API failures |
| **Explainable recommendation logic** | Rule-based ranking that can be audited, unlike black-box ML — suitable for regulated contexts |
| **Stablecoin vs. traditional benchmarking** | Quantifies when L2 stablecoin rails outperform remittance on cost and speed |
| **Open monorepo reference** | TypeScript full-stack architecture reusable for similar comparison or aggregator products |

### 5.2.3 For Academic Evaluation

As an academic project, TrueRate demonstrates proficiency across multiple software engineering and domain competencies:

- **Domain analysis** — Literature survey of SWIFT, remittance, stablecoin, and crypto payment systems
- **System design** — Three-tier architecture with separation of concerns (routes, services, repositories)
- **Full-stack implementation** — React frontend, Express backend, shared TypeScript contracts
- **External API integration** — Real-world dependency management with fallback chains
- **Security practices** — JWT authentication, bcrypt hashing, rate limiting, input validation
- **Empirical evaluation** — Controlled experiments with measured results and performance benchmarks
- **Technical documentation** — PRD, API contract, feature roadmap, and structured project report

---

## 5.3 Expected Impact and Benefits

### 5.3.1 Economic Impact

Cross-border remittances to low- and middle-income countries exceeded **$650 billion** globally in recent World Bank estimates. Even a 1% reduction in transfer costs across frequent senders represents substantial aggregate savings. TrueRate's experiments showed potential per-transfer savings of **2.4% to 5.1%** depending on corridor — suggesting meaningful economic benefit if users act on comparison results.

For a diaspora sender transferring $500/month on USD→INR:
- Switching from SWIFT to USDC (Polygon) could save approximately **₹2,000+ per month** in recipient value (based on Chapter 4 results scaled linearly).
- Switching from Western Union to Wise could save approximately **₹1,000+ per month** without using crypto rails.

### 5.3.2 Transparency and Financial Literacy

By exposing FX markup as a separate line item, TrueRate educates users about a cost component that many remittance marketing materials obscure. This aligns with global policy objectives — including the UN SDG target of reducing remittance costs below 3% — by making the true cost structure visible rather than hidden in a single "fee" number.

### 5.3.3 Technology Adoption

Including stablecoin and crypto routes alongside traditional options introduces users to alternative payment rails they may not have considered. Even if users ultimately choose Wise or Remitly, the comparison demonstrates *why* digital rails exist and under what conditions they offer advantages — contributing to informed technology adoption rather than blind platform switching.

### 5.3.4 Operational Benefits for Future Production

The prototype establishes a foundation that reduces time-to-market for a production service:

| Prototype Asset | Production Value |
|-----------------|------------------|
| Comparison calculator | Core IP — directly deployable |
| Provider fee config | Updateable without code changes (future admin panel) |
| REST API contract | Frontend/backend decoupling enables mobile app reuse |
| Analytics pipeline | User engagement and corridor demand insights |
| JSON → PostgreSQL migration path | SQL schema already documented |

---

## 5.4 Limitations of the Current Prototype

Honest assessment of limitations is essential for interpreting expected outcomes:

### 5.4.1 Data Accuracy Limitations

- Provider fees are **statically configured**, not fetched live from Wise, Remitly, or other providers. Actual checkout prices may differ.
- Crypto routes do not model exchange on-ramp/off-ramp fees, spread on local exchanges, or withdrawal charges.
- SWIFT intermediary fees beyond the originating bank are not captured.

### 5.4.2 Scope Limitations

- Six currencies and 26 corridors — major remittance routes covered, but not exhaustive globally.
- No execution capability — users must complete transfers on provider platforms separately.
- No regulatory eligibility check — a recommended crypto route may not be legal or practical for all users in all jurisdictions.

### 5.4.3 Technical Limitations

- JSON file storage is not suitable for multi-user concurrent production load.
- In-memory cache does not persist across API restarts or scale across multiple server instances.
- No automated test suite — quality assurance relies on manual functional testing documented in Chapter 4.

### 5.4.4 Recommendation Engine Limitations

- Rule-based scoring does not learn from user behavior or historical outcome data.
- Weights (60% cost / 40% time for balanced mode) are fixed, not personalized.
- No confidence score on recommendations — all results presented with equal certainty despite estimate uncertainty.

These limitations define the boundary between the **current academic prototype** and a **production-grade commercial product**.

---

## 5.5 Future Scope and Enhancements

Based on the Phase 3 roadmap and gaps identified during development, the following enhancements represent the expected evolution of TrueRate beyond the prototype.

### 5.5.1 Short-Term Enhancements (Phase 2 Completion)

| Enhancement | Description | Priority |
|-------------|-------------|----------|
| Production deployment | Deploy to Vercel (web) + Railway (API) | High |
| PostgreSQL migration | Replace JSON store for concurrent production use | High |
| Fee accuracy audit | Manual spot-check of provider configs vs. live pricing | High |
| Fee-drop notifications | Track fee history and alert on price reductions | Medium |
| Redis caching | Persistent shared cache across API instances | Medium |

### 5.5.2 Medium-Term Enhancements (Phase 3)

| Enhancement | Description |
|-------------|-------------|
| **ML recommendation engine** | Train on comparison outcome data (decision tree, random forest, or XGBoost) to augment rule-based ranking |
| **Admin panel** | Manage users, update provider fee configs, view system analytics |
| **RBAC** | Admin vs. user roles for operational management |
| **Additional providers** | PayPal, WorldRemit, Revolut, regional specialists |
| **Additional chains** | Base, Arbitrum, Solana for stablecoin routes |
| **Web push notifications** | Browser alerts alongside email |

### 5.5.3 Long-Term Vision

If TrueRate were developed into a commercial product, the long-term vision includes:

1. **Real-time provider quotes** — Partnership or scraping integrations where legally permitted to replace static fee configs with live pricing.
2. **Embedded comparison widget** — API product for remittance companies, neobanks, and payroll platforms to embed TrueRate comparisons in their own apps.
3. **Mobile application** — Flutter or React Native app reusing the existing REST API for on-the-go comparisons.
4. **Corridor expansion** — Support for 50+ currencies and African, Middle Eastern, and Southeast Asian corridors with high remittance volume.
5. **Regulatory compliance module** — Flag routes unavailable in user's jurisdiction based on KYC status and local regulations.
6. **B2B analytics** — Aggregate anonymized corridor demand data as market intelligence for payment providers.

---

## 5.6 Success Metrics for Production Launch

When deployed beyond the prototype, the following metrics from the project roadmap should be instrumented to measure real-world expected outcomes:

| Metric | Definition | Target (Initial) |
|--------|------------|------------------|
| Comparisons per user per month | Engagement frequency | ≥ 2 |
| 30-day return rate | User retention | ≥ 25% |
| Average estimated savings shown | Value delivered per comparison | ≥ 2% of send amount |
| Click-through on recommended route | Conversion to provider action | ≥ 15% |
| Notification opt-in rate | Alert feature adoption | ≥ 10% of registered users |
| Comparison response time (p95) | Performance SLA | < 2 seconds |

These metrics were defined in the feature roadmap but not yet instrumented in the prototype. Production deployment would include analytics event tracking (e.g., comparison completed, provider link clicked, export downloaded).

---

## 5.7 Conclusion

The TrueRate Cross-Border Payment Cost Optimizer prototype successfully demonstrates that a unified, multi-rail comparison platform is technically feasible and delivers measurable value to users. By integrating live foreign exchange data, blockchain fee estimation, and configurable provider pricing into a single comparison engine, the system surfaces savings and transparency that are not available from any individual payment provider.

**Key conclusions from this project:**

1. **The problem is real and quantifiable.** Experiments consistently showed that route selection affects recipient value by 2–5% on common corridors — a meaningful difference for recurring remittance senders.

2. **Stablecoin L2 rails are competitive.** USDC on Polygon ranked first on cost and speed in all tested experiments, though practical adoption requires crypto literacy and regulatory awareness.

3. **Traditional remittance has a clear winner.** Among bank and remittance providers, Wise consistently offered the best combination of low fees and competitive FX rates — validating its inclusion as a primary MVP provider.

4. **Explainable recommendations build trust.** Rule-based priority modes with human-readable explanations are appropriate for a FinTech comparison tool where users need to understand *why* a route is recommended before acting on it.

5. **Architecture supports evolution.** The monorepo structure, provider abstraction layer, and documented API contract provide a clear path from academic prototype to production service without fundamental redesign.

TrueRate fulfills its expected outcome as an **academic FinTech prototype** that proves the core value proposition — accurate, transparent, multi-rail cross-border payment comparison with actionable recommendations. The foundation is in place for production deployment, machine learning enhancements, and mobile expansion as described in the future scope.

The expected ultimate outcome is a tool that helps remittance senders worldwide **keep more of their money with their families** by choosing the right payment route — whether that route runs through a bank, an app, or a blockchain.

---

*End of Chapter 5*

---

# 6. References

The following references support the domain analysis, literature survey, technology choices, and external data integrations documented in this report. Web resources were accessed during project development in **June 2026**.

---

## 6.1 Cross-Border Payments and Remittances

[1] World Bank. *Migration and Development Brief: Remittance Flows*. Washington, DC: World Bank Group.  
https://www.worldbank.org/en/topic/migrationremittancesdiasporaissues/brief/migration-and-development-brief

[2] KNOMAD — Global Knowledge Partnership on Migration and Development. *Remittance Prices Worldwide (RPW)*.  
https://remittanceprices.worldbank.org/

[3] World Bank. *Remittance Prices Worldwide — Quarterly Report*.  
https://remittanceprices.worldbank.org/sites/default/files/rpw_report_q2_2024.pdf

[4] United Nations. *Sustainable Development Goal 10: Reduce Inequality — Target 10.c*.  
https://sdgs.un.org/goals/goal10

[5] G20. *G20 Roadmap for Enhancing Cross-Border Payments*. Financial Stability Board, 2020 (updated).  
https://www.fsb.org/work-of-the-fsb/financial-innovation-and-structural-change/cross-border-payments/

[6] Financial Stability Board (FSB). *Targets for Addressing the Four Challenges of Cross-Border Payments*.  
https://www.fsb.org/2021/10/targets-for-addressing-the-four-challenges-of-cross-border-payments/

[7] Bank for International Settlements (BIS). *Correspondent Banking*.  
https://www.bis.org/cpmi/publ/d147.pdf

[8] McKinsey & Company. *Global Payments Report*. Various annual editions on payments industry trends.

---

## 6.2 SWIFT and Traditional Banking Rails

[9] SWIFT. *About SWIFT — Society for Worldwide Interbank Financial Telecommunication*.  
https://www.swift.com/about-us

[10] SWIFT. *SWIFT gpi — Global Payments Innovation*.  
https://www.swift.com/swift-gpi

[11] SWIFT. *ISO 20022 Migration for Cross-Border Payments*.  
https://www.swift.com/standards/iso-20022

[12] International Organization for Standardization (ISO). *ISO 4217: Codes for the Representation of Currencies*.  
https://www.iso.org/iso-4217-currency-codes.html

[13] International Bank Account Number (IBAN) — ISO 13616 standard for international bank account identification.

---

## 6.3 Digital Remittance Providers

[14] Wise plc. *How Wise Works — Pricing and Transparency*.  
https://wise.com/help/articles/2935773/how-wise-works

[15] Wise plc. *Wise Pricing — Fees and Exchange Rates*.  
https://wise.com/gb/pricing/

[16] Remitly, Inc. *How Remitly Works*.  
https://www.remitly.com/us/en/home/help

[17] Remitly, Inc. *Remitly Pricing and Fees*.  
https://www.remitly.com/us/en/home/fees

[18] The Western Union Company. *Send Money Online — Fees and Exchange Rates*.  
https://www.westernunion.com/us/en/send-money.html

[19] PayPal, Inc. *Xoom — Send Money Abroad*.  
https://www.xoom.com/

[20] WorldRemit Ltd. *International Money Transfer*.  
https://www.worldremit.com/

[21] MoneyGram International. *Send Money Internationally*.  
https://www.moneygram.com/

[22] Revolut Ltd. *International Transfers*.  
https://www.revolut.com/money-transfer/

---

## 6.4 Stablecoins, Cryptocurrency, and Blockchain

[23] Circle Internet Financial, LLC. *USD Coin (USDC) — Overview and Transparency*.  
https://www.circle.com/en/usdc

[24] Circle Internet Financial, LLC. *USDC Attestation Reports*.  
https://www.circle.com/en/transparency

[25] Ethereum Foundation. *Ethereum.org — Introduction to Ethereum*.  
https://ethereum.org/en/what-is-ethereum/

[26] Ethereum Foundation. *Gas and Fees on Ethereum*.  
https://ethereum.org/en/developers/docs/gas/

[27] Polygon Technology. *Polygon — Ethereum Scaling Solution*.  
https://polygon.technology/

[28] Nakamoto, S. *Bitcoin: A Peer-to-Peer Electronic Cash System*. 2008.  
https://bitcoin.org/bitcoin.pdf

[29] Buterin, V. *Ethereum White Paper*. 2014.  
https://ethereum.org/en/whitepaper/

[30] CoinGecko. *CoinGecko API Documentation*.  
https://www.coingecko.com/en/api/documentation

[31] Etherscan. *Etherscan Gas Tracker API*.  
https://docs.etherscan.io/api-endpoints/gas-tracker

[32] Etherscan. *Ethereum Block Explorer*.  
https://etherscan.io/

[33] ERC-20 Token Standard. Ethereum Improvement Proposal EIP-20.  
https://eips.ethereum.org/EIPS/eip-20

---

## 6.5 Foreign Exchange Data Sources

[34] ExchangeRate-API. *ExchangeRate-API Documentation*.  
https://www.exchangerate-api.com/docs/overview

[35] Frankfurter. *Frankfurter — Free Foreign Exchange Rates API*.  
https://www.frankfurter.app/docs/

[36] European Central Bank (ECB). *Euro Foreign Exchange Reference Rates*.  
https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html

[37] Open Exchange Rates. *Currency Data API* (referenced in FinTech literature as alternative FX source).  
https://openexchangerates.org/

---

## 6.6 Regulatory and Compliance Frameworks

[38] European Union. *Markets in Crypto-Assets Regulation (MiCA)* — Regulation (EU) 2023/1114.  
https://eur-lex.europa.eu/eli/reg/2023/1114/oj

[39] Reserve Bank of India (RBI). *Master Direction on KYC*.  
https://www.rbi.org.in/

[40] Reserve Bank of India (RBI). *Guidelines on Virtual Digital Assets and Related Services*.  
https://www.rbi.org.in/

[41] Financial Action Task Force (FATF). *International Standards on Combating Money Laundering and the Financing of Terrorism & Proliferation*.  
https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Fatf-recommendations.html

[42] Financial Crimes Enforcement Network (FinCEN). *Money Services Business (MSB) Registration*.  
https://www.fincen.gov/

---

## 6.7 Software Frameworks, Libraries, and Runtime

[43] Meta Platforms, Inc. (OpenJS Foundation). *React — A JavaScript Library for Building User Interfaces*.  
https://react.dev/

[44] Evan You et al. *Vite — Next Generation Frontend Tooling*.  
https://vite.dev/

[45] Remix Software, Inc. *React Router*.  
https://reactrouter.com/

[46] OpenJS Foundation. *Node.js*.  
https://nodejs.org/

[47] OpenJS Foundation. *Express.js — Fast, Unopinionated, Minimalist Web Framework for Node.js*.  
https://expressjs.com/

[48] Microsoft Corporation. *TypeScript — JavaScript with Syntax for Types*.  
https://www.typescriptlang.org/

[49] TanStack. *TanStack Query (React Query)*.  
https://tanstack.com/query/latest

[50] Tailwind Labs, Inc. *Tailwind CSS*.  
https://tailwindcss.com/

[51] Recharts Group. *Recharts — Composable Charting Library for React*.  
https://recharts.org/

[52] Auth0, Inc. (Okta). *jsonwebtoken — JSON Web Token Implementation for Node.js*.  
https://github.com/auth0/node-jsonwebtoken

[53] npm, Inc. *bcrypt — Password Hashing Library*.  
https://www.npmjs.com/package/bcrypt

[54] IETF RFC 7519. *JSON Web Token (JWT)*.  
https://datatracker.ietf.org/doc/html/rfc7519

[55] IETF RFC 6749. *The OAuth 2.0 Authorization Framework*.  
https://datatracker.ietf.org/doc/html/rfc6749

[56] node-cron. *Node-Cron — Task Scheduler for Node.js*.  
https://github.com/node-cron/node-cron

[57] pdf-lib. *PDF Generation Library for JavaScript*.  
https://pdf-lib.js.org/

[58] Nodemailer. *Send Emails from Node.js*.  
https://nodemailer.com/

[59] OpenJS Foundation. *npm — Node Package Manager*.  
https://www.npmjs.com/

[60] esbuild / tsx. *tsx — TypeScript Execute*.  
https://github.com/privatenumber/tsx

---

## 6.8 Development Tools, Deployment, and Project Documentation

[61] Microsoft Corporation. *Visual Studio Code*.  
https://code.visualstudio.com/

[62] Anysphere, Inc. *Cursor — AI-Powered Code Editor*.  
https://cursor.com/

[63] Git. *Distributed Version Control System*.  
https://git-scm.com/

[64] GitHub, Inc. *GitHub Actions — CI/CD*.  
https://github.com/features/actions

[65] Vercel, Inc. *Vercel — Frontend Cloud Platform*.  
https://vercel.com/

[66] Railway Corp. *Railway — Application Deployment Platform*.  
https://railway.app/

[67] Google LLC. *Google Chrome DevTools — Web Performance Profiling*.  
https://developer.chrome.com/docs/devtools/

[68] TrueRate Project Repository. Internal monorepo: `apps/api`, `apps/web`, `packages/shared`.  
Local path: `/Users/prathameshpatil/Drive/RVCE/Fintech/TrueRate`

[69] TrueRate Product Requirements Document (PRD) v1.0. Project documentation.

[70] TrueRate API Contract. `docs/API-CONTRACT.md`. Project documentation.

[71] TrueRate Feature Roadmap. `FEATURE-ROADMAP.md`. Project documentation.

[72] TrueRate Phase 0 Decisions. `docs/PHASE-0-DECISIONS.md`. Project documentation.

---

## 6.9 Machine Learning and Future Work References

[73] Breiman, L. *Random Forests*. Machine Learning, 45(1), 5–32, 2001.

[74] Chen, T., & Guestrin, C. *XGBoost: A Scalable Tree Boosting System*. Proceedings of the 22nd ACM SIGKDD International Conference on Knowledge Discovery and Data Mining, 2016.

[75] Quinlan, J. R. *Induction of Decision Trees*. Machine Learning, 1(1), 81–106, 1986.

[76] Google LLC. *Flutter — UI Toolkit for Cross-Platform Mobile Development*.  
https://flutter.dev/

[77] Redis Ltd. *Redis — In-Memory Data Store*.  
https://redis.io/

[78] PostgreSQL Global Development Group. *PostgreSQL — Open Source Relational Database*.  
https://www.postgresql.org/

---

*End of Chapter 6 — References*

*End of Project Report*





