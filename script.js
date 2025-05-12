window.onload = () => {
  const connection = new solanaWeb3.Connection(
    "https://green-blue-tab.solana-mainnet.quiknode.pro/e7b8636685092d373b3a5c9603256cf4e404f5a5/",
    "confirmed"
  );

  document.getElementById("checkButton").addEventListener("click", async () => {
    const slot = document.getElementById("slotInput").value.trim();
    const account = document.getElementById("accountInput").value.trim();
    const output = document.getElementById("output");

    if (!slot || !account) {
      output.textContent = "❗ Por favor, ingresa un slot y una cuenta.";
      return;
    }

    try {
      const publicKey = new solanaWeb3.PublicKey(account);
      const block = await connection.getBlock(parseInt(slot), {
        maxSupportedTransactionVersion: 0
      });

      if (!block || !block.transactions || block.transactions.length === 0) {
        output.textContent = `❌ No se encontraron transacciones en el slot ${slot}`;
        return;
      }

      const participated = block.transactions.some(tx => {
        const keys = tx.transaction.message.accountKeys.map(k => k.toBase58());
        return keys.includes(publicKey.toBase58());
      });

      output.textContent = participated
        ? `✅ La cuenta participó en el slot ${slot}.`
        : `❌ La cuenta NO participó en el slot ${slot}.`;

      // Descargar el bloque como archivo JSON
      const blob = new Blob([JSON.stringify(block, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `slot_${slot}.json`;
      link.click();
      URL.revokeObjectURL(url); // Limpieza

    } catch (err) {
      output.textContent = `🚫 Error: ${err.message}`;
    }
  });
};
