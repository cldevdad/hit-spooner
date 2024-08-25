import { useEffect, useState } from "react";

export const useNextTransferDate = () => {
  const [nextTransferDate, setNextTransferDate] = useState<string | null>(null);

  useEffect(() => {
    const fetchNextTransferDate = async () => {
      const response = await fetch("https://worker.mturk.com/earnings", {
        credentials: "include",
      });
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/html");
      const transferDateElement = doc.evaluate(
        '//*[@id="MainContent"]/div[3]/div[1]/div[3]/div/strong',
        doc,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;

      if (transferDateElement) {
        setNextTransferDate(transferDateElement.textContent || null);
      }
    };

    fetchNextTransferDate();
  }, []);

  return nextTransferDate;
};
