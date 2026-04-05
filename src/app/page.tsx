"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Memo = {
  id: string;
  content: string;
  created_at: string;
};

export default function Home() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemos();
  }, []);

  async function fetchMemos() {
    const { data } = await supabase
      .from("memos")
      .select("*")
      .order("created_at", { ascending: false });
    setMemos(data ?? []);
    setLoading(false);
  }

  async function addMemo() {
    if (!input.trim()) return;
    const { error } = await supabase.from("memos").insert({ content: input });
    if (!error) {
      setInput("");
      fetchMemos();
    }
  }

  async function deleteMemo(id: string) {
    const { error } = await supabase.from("memos").delete().eq("id", id);
    if (!error) {
      fetchMemos();
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Memo App</h1>

      <div className="mb-8 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addMemo()}
          placeholder="メモを入力..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800"
        />
        <button
          onClick={addMemo}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
        >
          保存
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">読み込み中...</p>
      ) : memos.length === 0 ? (
        <p className="text-gray-500">メモがありません</p>
      ) : (
        <ul className="space-y-3">
          {memos.map((memo) => (
            <li
              key={memo.id}
              className="flex items-start justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
            >
              <div>
                <p className="whitespace-pre-wrap">{memo.content}</p>
                <p className="mt-1 text-sm text-gray-400">
                  {new Date(memo.created_at).toLocaleString("ja-JP")}
                </p>
              </div>
              <button
                onClick={() => deleteMemo(memo.id)}
                className="ml-4 shrink-0 text-sm text-red-500 hover:text-red-700"
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
