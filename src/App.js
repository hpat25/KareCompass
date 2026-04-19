import { useEffect, useRef, useState } from "react";
import "./App.css";
import providers from "./data/providers";
import { processProviders } from "./logic/scoring";
import { getAIExplanation } from "./logic/ai";

const insuranceOptions = ["Aetna", "BlueCross", "Cigna", "Medicaid", "Medicare", "United"];

function detectQuestionType(question) {
  const q = question.trim().toLowerCase();

  if (
    (q.startsWith("what is") &&
      !q.includes("cheapest") &&
      !q.includes("best") &&
      !q.includes("provider")) ||
    q.startsWith("define") ||
    q.includes("meaning")
  ) {
    return "definition";
  }

  return "provider";
}

function postToMap(iframe, message) {
  iframe?.contentWindow?.postMessage(message, "*");
}

function App() {
  const iframeRef = useRef(null);
  const [hasInsurance, setHasInsurance] = useState(true);
  const [insurance, setInsurance] = useState("Aetna");

  const currentUser = {
    budget: 100,
    insurance: hasInsurance ? insurance : "",
  };

  const results = processProviders(providers, currentUser);

  useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe) {
      return undefined;
    }

    function pushProviders() {
      postToMap(iframe, {
        type: "LOAD_PROVIDERS",
        data: results,
      });
    }

    async function handleMessage(event) {
      if (event.source !== iframe.contentWindow || !event.data?.type) {
        return;
      }

      if (event.data.type === "MAP_READY") {
        pushProviders();
        return;
      }

      if (event.data.type === "PROVIDER_SELECTED") {
        return;
      }

      if (event.data.type === "ASK_AI") {
        const provider =
          results.find((item) => item.id === event.data.provider?.id) ||
          event.data.provider ||
          results.reduce((best, item) =>
            item.finalScore > best.finalScore ? item : best
          );

        try {
          const text = await getAIExplanation(
            provider,
            currentUser,
            event.data.question,
            detectQuestionType(event.data.question)
          );

          postToMap(iframe, {
            type: "AI_RESPONSE",
            requestId: event.data.requestId,
            text,
          });
        } catch (error) {
          postToMap(iframe, {
            type: "AI_RESPONSE",
            requestId: event.data.requestId,
            text:
              error?.message ||
              "I could not reach the KareCompass assistant right now. Please try again in a moment.",
          });
        }
      }
    }

    iframe.addEventListener("load", pushProviders);
    window.addEventListener("message", handleMessage);

    return () => {
      iframe.removeEventListener("load", pushProviders);
      window.removeEventListener("message", handleMessage);
    };
  }, [results, currentUser]);

  return (
    <div className="appShell">
      <section className="controlsBar" aria-label="Insurance controls">
        <label className="toggleRow">
          <input
            type="checkbox"
            checked={hasInsurance}
            onChange={(event) => setHasInsurance(event.target.checked)}
          />
          <span>Has insurance</span>
        </label>

        <label className="selectGroup">
          <span>Plan</span>
          <select
            value={insurance}
            onChange={(event) => setInsurance(event.target.value)}
            disabled={!hasInsurance}
          >
            {insuranceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </section>

      <div className="mapStage">
        <section className="mapSection">
          <iframe
            ref={iframeRef}
            className="mapFrame"
            src="/map/interactive_map.html"
            title="KareCompass provider map"
          />
        </section>
      </div>
    </div>
  );
}

export default App;
