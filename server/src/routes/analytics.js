const express = require("express");
const { supabase } = require("../services/supabaseClient");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { count } = await supabase
      .from("invoices")
      .select("*", { count: "exact", head: true });

    const { data } = await supabase.from("invoices").select("*");

    res.json({
      total_invoices: count,
      data,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;