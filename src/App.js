import providers from "./data/providers";
import { processProviders } from "./logic/scoring";

function App() {
  const user = {
    budget: 100,
    insurance: "Aetna"
  };

  const results = processProviders(providers, user);

  return (
    <div>
      <h1>KareCompass</h1>

      {results.map((p) => (
        <div key={p.id} style={{ marginBottom: "20px" }}>
          <h2>{p.name}</h2>
          <p>Cost: ${p.adjustedCost.toFixed(2)}</p>
          <p>Affordability: {p.affordabilityScore}</p>
          <p>Accessibility: {p.accessibilityScore}</p>
          <p>Final Score: {p.finalScore}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
