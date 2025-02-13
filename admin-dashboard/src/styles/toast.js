import { css } from "@emotion/react";

export const toastStyles = css`
  @keyframes toast-slide-in {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes toast-progress {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }

  .Toaster > div > div {
    padding-bottom: 20px !important;
  }

  .Toaster > div > div::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: #e0e0e0;
  }

  .Toaster > div > div::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: #4caf50;
    animation: toast-progress 3s linear forwards;
    z-index: 1;
  }
`;

export const toastConfig = {
  duration: 3000,
  className: "",
  style: {
    background: "#fff",
    color: "#333",
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    animation: "toast-slide-in 0.3s ease-out",
    position: "relative",
    overflow: "hidden",
  },
  success: {
    iconTheme: {
      primary: "#4CAF50",
      secondary: "#fff",
    },
  },
  error: {
    iconTheme: {
      primary: "#f44336",
      secondary: "#fff",
    },
  },
};
