const pool = require("../Config/DB");

const identifyController = async (req, res) => {
  const { email, phoneNumber } = req.body;
  if (!email && !phoneNumber) {
    return res
      .status(400)
      .json({ error: "Provide at least email or phoneNumber" });
  }
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Contact WHERE email = ? OR phoneNumber = ?",
      [email, phoneNumber]
    );

    let primaryContact = null;
    let secondaryContacts = [];

    if (rows.length > 0) {
      primaryContact =
        rows.find((c) => c.linkPrecedence === "primary") || rows[0];
      secondaryContacts = rows.filter((c) => c.id !== primaryContact.id);
    }

    if (!primaryContact) {
      const [newContact] = await pool.query(
        "INSERT INTO Contact (email, phoneNumber, linkPrecedence) VALUES (?, ?, 'primary')",
        [email, phoneNumber]
      );

      primaryContact = {
        id: newContact.insertId,
        email,
        phoneNumber,
        linkPrecedence: "primary",
      };
    } else if (
      rows.length > 0 &&
      !rows.some((c) => c.email === email && c.phoneNumber === phoneNumber)
    ) {
      const [newSecondary] = await pool.query(
        "INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence) VALUES (?, ?, ?, 'secondary')",
        [email, phoneNumber, primaryContact.id]
      );

      secondaryContacts.push({ id: newSecondary.insertId, email, phoneNumber });
    }
    res.json({
      contact: {
        primaryContactId: primaryContact.id,
        emails: [
          primaryContact.email,
          ...secondaryContacts.map((c) => c.email),
        ].filter(Boolean),
        phoneNumbers: [
          primaryContact.phoneNumber,
          ...secondaryContacts.map((c) => c.phoneNumber),
        ].filter(Boolean),
        secondaryContactIds: secondaryContacts.map((c) => c.id),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { identifyController };
