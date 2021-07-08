import { useEffect, useState } from "react";

import DateTime from "components/DateTime";
import moment from "moment";
import styled from "styled-components";

const HomeStyle = styled.section`
  display: flex;
  flex-flow: column nowrap;

  justify-content: center;
  align-items: center;

  max-width: 250px;
`;
HomeStyle.displayName = "HomeStyle";

const Info = styled.span`
  margin-top: 24px;

  font-size: 0.9em;
  ${({ theme }) => theme.font.primary}
`;
Info.displayName = "Info";

const Logo = styled.div`
  display: flex;
  align-items: center;
  ${({ theme }) => theme.font.primary}

  --size: 20px;
  font-size: var(--size);

  > :first-child {
    margin-right: 1em;

    > div {
      transform: scale(1, 0.9);
      line-height: 1em;
    }
  }

  > :last-child {
    font-size: calc(var(--size) * 1.8);
  }
`;
Logo.displayName = "Logo";

const Disclaimer = styled.div`
  ${({ visible }) =>
    visible
      ? `
  opacity: 1;
  `
      : `
  opacity: 0;
  `};
  transition: opacity 0.2s ease-in-out;

  margin-top: 64px;
  height: 80px;
  text-align: center;
`;
Disclaimer.displayName = "Disclaimer";

const TestDate = styled.div`
  margin-top: 8px;
  font-size: 1.25em;
  ${({ theme }) => theme.font.primary}
`;
TestDate.displayName = "TestDate";

const Language = styled.div`
  position: fixed;
  top: 48px;
  left: 56px;
  cursor: pointer;
  user-select: none;
  ${({ theme }) => theme.font.primary}
`;
Language.displayName = "Language";

const dictionary = {
    en: {
      info: "Enter your flight date",
      message: "Take your test between this date and your flight date",
    },
    pl: {
      info: "Wprowadź datę wylotu",
      message: "Możesz zrobić test między tą datą, a twoim wylotem",
    },
  },
  reverse = {
    en: "pl",
    pl: "en",
  };

export default function Home() {
  const [earliestTestDate, setEarliestTestDate] = useState(),
    [language, setLanguage] = useState();

  useEffect(() => {
    setLanguage(window.localStorage.getItem("language") || "en");
  }, []);

  useEffect(() => {
    language && window.localStorage.setItem("language", language);
  }, [language]);

  const callback = (timestamp) =>
      setEarliestTestDate(
        timestamp
          ? moment(timestamp - 48 * 3600000).format("D . M . YYYY ,  HH : mm")
          : ""
      ),
    toggleLanguage = () => setLanguage((prev) => reverse[prev]);

  return (
    <HomeStyle>
      <Logo>
        <div>
          <div>48h</div>
          <div>TEST</div>
        </div>
        <div>FLIGHT</div>
      </Logo>
      <Info>{dictionary[language || "en"].info}</Info>
      <DateTime callback={callback} language={language || "en"} />
      <Disclaimer visible={earliestTestDate ? true : false}>
        <div>{dictionary[language || "en"].message}</div>
        <TestDate>{earliestTestDate}</TestDate>
      </Disclaimer>
      <Language onClick={toggleLanguage}>{reverse[language || "en"]}</Language>
    </HomeStyle>
  );
}
