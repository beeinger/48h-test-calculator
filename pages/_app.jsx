import { ThemeProvider, createGlobalStyle } from "styled-components";
import { useEffect, useState } from "react";

import DarkModeToggle from "react-dark-mode-toggle";
import Head from "next/head";

const themes = {
    light: {
      main: "#000000",
      body: "#ffffff",
    },
    dark: {
      main: "#ffffff",
      body: "#000000",
    },
  },
  font = {
    primary: `
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  `,
    secondary: `
  font-family: 'Poppins', sans-serif;
  font-weight: 300;
  `,
  };

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.main};

    ${({ theme }) => theme.font.secondary}

    > div {
      width: 100vw;
      height: 100vh;
      height: calc(var(--vh, 1vh) * 100);
      
      display: flex;
      justify-content: center;
      align-items: center;

      > button {
        position: fixed;
        top: 48px;
        right: 56px;
      }
    }
  }
`;

export default function App({ Component, pageProps }) {
  const [isDark, setIsDark] = useState(null);

  const handleResize = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };

  useEffect(() => {
    const _isDark = window.localStorage.getItem("isDark");
    setIsDark(
      _isDark === null
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
        : _isDark === "true"
        ? true
        : false
    );

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isDark === null) return;
    isDark !== window.matchMedia("(prefers-color-scheme: dark)").matches
      ? window.localStorage.setItem("isDark", isDark)
      : window.localStorage.removeItem("isDark");
  }, [isDark]);

  return (
    <ThemeProvider theme={{ ...themes[isDark ? "dark" : "light"], font }}>
      <Head>
        <meta charset="UTF-8" />
        <meta
          name="description"
          content="A simple calculator - input your flight date and get the date when you should take your COVID-19 test."
        />
        <meta
          name="keywords"
          content="flight, lot, test, COVID-19, SARS-CoV-2, pandemic, epidemic, pandemia, epidemia, samolot, wakacje, plane, holidays"
        />
        <meta name="author" content="beeinger" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>48h TEST FLIGHT CALCULATOR</title>

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;600&display=swap"
          rel="stylesheet"
        />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <GlobalStyle />
      <DarkModeToggle onChange={setIsDark} checked={isDark} size={60} />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
