# BonkX - Solana Hackathon Submission

Project Type: Fintech on Solana  
Track: Consumer / Payments / Gaming / Mobile dApp

## 🧠 Concept

BonkX is the first *memecoin-native spending platform* built for the degen economy. It lets users top up with $BONK and other Solana tokens, spend anywhere via a virtual or physical card, and earn juicy cashback in $BONK. It fuses real-world payments with meme culture and gamified viral growth.

Core features:

- Top-up cards using $BONK and other Solana tokens  
- Real-world spending (Visa/Mastercard rails)  
- Memecoin liquidity routing (via Jupiter)  
- Gamified cashback + referral system in $BONK  
- Viral daily missions to earn rewards and drive volume  
- Simple on/off-ramp flows, optimized for degens

Visit → [https://bonkx.io](https://bonkx.io)

## 🌐 Architecture

The backend is a high-availability, microservices-oriented system designed to unify multiple services seamlessly into a single API layer for the mobile applications.

### Technology Stack

Cloud Infrastructure (AWS):
- EC2, Lambda, Route 53, API Gateway, CloudWatch, S3, RDS (PostgreSQL)
- Infrastructure-as-Code: Migrating from Pulumi to Terraform

Backend Development (TypeScript):
- Express.js (REST API)
- Sequelize (ORM)
- PM2 (Process Management)
- Jest (Automated Testing)
- Mega Linter (Code Quality Enforcement)

Communication Services:
- Twilio (SMS)
- SendGrid (Email)
- Firebase (Push Notifications)
- Slack (Operational Alerts)

Monitoring & Analytics:
- AWS CloudWatch
- Firebase Analytics
- Sentry (Performance & Error Monitoring)

Ancillary Integrations:
- Verestro (Banking API)
- CoinGecko (Real-time Crypto Pricing)
- CryptoApis (Wallet Transaction History)
- NowPayments (Crypto Top-Up)
- OpenAI (AI-Driven Transaction Enrichment)

Containerization & Orchestration:
- Docker
- Kubernetes (in progress)

### Mobile Application

Developed with React Native, the BonkX mobile app delivers a seamless native experience across iOS and Android.

Key Technologies:
- TypeScript for scalable code
- Trust Wallet library (secure, non-custodial crypto wallet)
- RNSecureStorage (sensitive data storage)
- Firebase AppCheck (app integrity protection)

The mobile app is tightly coupled with the backend services to ensure high performance, robust security, and a smooth UX.

> Visual diagram available in /architecture/architecture-diagram.png

## 🖼 UI Previews

Screenshots of the BONK Card, Spending Flow, Cashback Missions, and $BONK Top-up Interface.

> See /frontend/demo-ui-screenshots.png

## 🔒 IP Notice

BonkX is in active development with proprietary infrastructure and licensed integrations. Source code is private; this repo is for hackathon submission purposes only.

## 📄 Docs

- /docs/pitch-deck.pdf

## ⛓️ Solana Program

BonkX integrates with the Jupiter Aggregator for routing Solana swaps, uses custom liquidity scoring, and manages cashback through in-house smart contract logic.

> Sample contract structure in /contracts/.

## 📫 Contact

- Website: [https://bonkx.io](https://bonkx.io)  
- X account: [https://x.com/BonkX_SOL](https://x.com/BonkX_SOL)
- Telegram: [https://t.me/bonkx](https://t.me/bonkx)
