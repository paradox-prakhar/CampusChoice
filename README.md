# VibeCraft DAO (CampusChoice)

![VibeCraft DAO Banner](/frontend/public/vite.svg)

**Live Demo:** [https://campuschoice.vercel.app](https://campuschoice.vercel.app?_vercel_share=pMKch91FHQoeamksiA2ZuL9cWrkwXpIM)

## 🚀 Overview

VibeCraft DAO (CampusChoice) is a decentralized platform that empowers students to democratically decide on campus events through blockchain technology. By leveraging quadratic voting, we ensure fair representation and prevent plutocracy, giving every student a meaningful voice in how university funds are allocated.

## ✨ Key Features

-   **Quadratic Voting:** A revolutionary voting mechanism where voting power is the square root of tokens committed, ensuring fairer influence.
-   **Decentralized Governance:** All proposals and votes are recorded on-chain for transparency and immutability.
-   **Proposal Creation:** Students can submit detailed event proposals including budget, timeline, and description.
-   **AI-Powered Insights:** (Optional) Smart analysis features to help users craft better proposals.
-   **Real-time Dashboard:** Interactive dashboard to track active proposals, voting status, and treasury funds.
-   **Wallet Connection:** Seamless integration with MetaMask (and mock wallet support for testing).

## � Screenshots

| Landing Page | Dashboard |
|:---:|:---:|
| ![Landing Page](/frontend/src/assets/campuschoice-logo.png) | ![Dashboard](/frontend/src/assets/campuschoice-logo.png) |
| *Modern Landing Page* | *Interactive Voter Dashboard* |

| Proposal Creation | Voting Flow |
|:---:|:---:|
| ![Proposal Form](/frontend/src/assets/campuschoice-logo.png) | ![Voting](/frontend/src/assets/campuschoice-logo.png) |
| *Create Event Proposals* | *Quadratic Voting in Action* |

> *Note: Please replace the placeholder paths above with actual screenshot files in your repository.*

## �🛠️ Tech Stack

-   **Frontend:** React, TypeScript, Vite, Tailwind CSS
-   **Backend:** Node.js, Express
-   **Database:** PostgreSQL (with in-memory fallback for demo)
-   **Blockchain Interaction:** Ethers.js
-   **Icons:** Lucide React

## 📦 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/paradox-prakhar/vibecraft.git
    cd vibecraft
    ```

2.  **Install Dependencies:**

    *Frontend:*
    ```bash
    cd frontend
    npm install
    ```

    *Backend:*
    ```bash
    cd backend
    npm install
    ```

3.  **Run Locally:**

    *Start Backend (Port 3001):*
    ```bash
    cd backend
    npm start
    ```

    *Start Frontend (Port 5173):*
    ```bash
    cd frontend
    npm run dev
    ```

## 🌐 Deployment

The project is deployed on Vercel.

-   **Frontend:** [CampusChoice Live](https://campuschoice.vercel.app?_vercel_share=pMKch91FHQoeamksiA2ZuL9cWrkwXpIM)

## 📖 How It Works

1.  **Connect Wallet:** Users connect their Ethereum wallet.
2.  **Browse/Propose:** View active event proposals or submit a new one.
3.  **Vote:** Use DAO tokens to vote. Quadratic voting applies cost = (votes)^2 to balance power.
4.  **Execute:** Winning proposals receive automated funding approval.

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements.

---

Built for the Hackathon 2026.
