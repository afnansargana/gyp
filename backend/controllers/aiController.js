const { analyzeSymptoms } = require("../services/ai.service");

exports.analyze = async (req, res) => {
  try {
    const symptoms = String(req.body.symptoms || "").trim();
    if (symptoms.length < 8) {
      return res.status(400).json({
        message: "Describe the issue in a bit more detail (at least 8 characters).",
      });
    }
    const result = await analyzeSymptoms(symptoms);
    res.json(result);
  } catch (error) {
    console.error("AI analyze error:", error);
    res.status(500).json({ message: "Diagnostics unavailable right now." });
  }
};
