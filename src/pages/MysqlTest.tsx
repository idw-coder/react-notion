import { useState } from "react";
import { pingMySql } from "@/modules/mysql/mysql.repository"; // ← 修正

export default function MysqlTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  async function handlePing() {
    setLoading(true);
    setResult("");
    try {
      const res = await pingMySql();
      if (res.ok) {
        setResult(`OK ${res.now ?? ""}`.trim());
      } else {
        setResult(`NG ${res.error ?? ""}`.trim());
      }
    } catch (e: any) {
      setResult(`NG ${e?.message ?? "unknown error"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-sm px-4 py-2 space-y-3">
      <div className="font-medium">mysql test</div>
      <div className="flex items-center gap-2">
        <button
          className="px-3 py-1 rounded bg-black text-white disabled:opacity-50"
          onClick={handlePing}
          disabled={loading}
        >
          {loading ? "Pinging..." : "Ping MySQL"}
        </button>
        {result && <span className="text-xs">{result}</span>}
      </div>
    </div>
  );
}
