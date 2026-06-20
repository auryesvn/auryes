"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const BASE_URL = "https://auryes.vn";

type RedirectItem = {
  id: string;
  code: string;
  type: string;
  title: string;
  note: string | null;
  owner: string | null;
  target_url: string;
  hits: number;
  last_hit_at: string | null;
  created_at: string;
  slug: string | null;
};

function generateCode(length = 5) {
  let code = "";

  for (let i = 0; i < length; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }

  return code;
}

export default function Home() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("artifact");
  const [owner, setOwner] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [note, setNote] = useState("");
  const [slug, setSlug] = useState("");

  const [createdCode, setCreatedCode] = useState("");
  const [items, setItems] = useState<RedirectItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadItems() {
    const { data, error } = await supabase
      .from("redirects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setItems(data ?? []);
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function handleCreate() {
    if (!title.trim()) return alert("Thiếu title");
    if (!targetUrl.trim()) return alert("Thiếu target URL");

    setLoading(true);

    const code = await generateUniqueCode();

    async function generateUniqueCode() {
      for (let i = 0; i < 20; i++) {
        const code = generateCode();

        const { data } = await supabase
          .from("redirects")
          .select("id")
          .eq("code", code)
          .maybeSingle();

        if (!data) return code;
      }

      throw new Error("Cannot generate unique code");
    }

    const { error } = await supabase.from("redirects").insert({
      code,
      type,
      title,
      owner: owner || null,
      note,
      target_url: targetUrl,
      slug: slug || null,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setCreatedCode(code);
    setTitle("");
    setOwner("");
    setTargetUrl("");
    setNote("");
    await loadItems();
    setSlug("");
  }

  async function copyUrl(code: string) {
    await navigator.clipboard.writeText(`${BASE_URL}/r/${code}`);
    alert("Copied");
  }

  return (
    <main className="max-w-5xl mx-auto p-8 space-y-8">
      <section className="max-w-xl space-y-4">
        <h1 className="text-3xl font-bold">Auryes Registry</h1>

        <input
          className="border p-2 w-full bg-transparent"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          className="border p-2 w-full bg-transparent"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="citizen">citizen</option>
          <option value="artifact">artifact</option>
          <option value="passport">passport</option>
          <option value="wifi">wifi</option>
          <option value="event">event</option>
          <option value="pickleball">pickleball</option>
          <option value="other">other</option>
        </select>

        <input
          className="border p-2 w-full bg-transparent"
          placeholder="Owner"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
        />

        <input
          className="border p-2 w-full bg-transparent"
          placeholder="Slug, optional: chai-cat-bali"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />

        <input
          className="border p-2 w-full bg-transparent"
          placeholder="Target URL"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
        />

        <textarea
          className="border p-2 w-full bg-transparent"
          placeholder="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-white text-black px-4 py-2 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create"}
        </button>

        {createdCode && (
          <div className="p-4 border space-y-2">
            <p>Code: {createdCode}</p>
            <p>URL: {`${BASE_URL}/r/${createdCode}`}</p>
            <button
              className="border px-3 py-1"
              onClick={() => copyUrl(createdCode)}
            >
              Copy URL
            </button>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Items</h2>

        <div className="overflow-x-auto border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-2">Code</th>
                <th className="p-2">Type</th>
                <th className="p-2">Title</th>
                <th className="p-2">Slug</th>
                <th className="p-2">Owner</th>
                <th className="p-2">Hits</th>
                <th className="p-2">Last hit</th>
                <th className="p-2">Target</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-2 font-mono">{item.code}</td>
                  <td className="p-2">{item.type}</td>
                  <td className="p-2">{item.title}</td>
                  <td className="p-2">{item.slug ?? "-"}</td>
                  <td className="p-2">{item.owner ?? "-"}</td>
                  <td className="p-2">{item.hits ?? 0}</td>
                  <td className="p-2">
                    {item.last_hit_at
                      ? new Date(item.last_hit_at).toLocaleString()
                      : "-"}
                  </td>
                  <td className="p-2 max-w-xs truncate">{item.target_url}</td>
                  <td className="p-2">
                    <button
                      className="border px-2 py-1"
                      onClick={() => copyUrl(item.code)}
                    >
                      Copy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          gm
        </div>
      </section>
    </main>
  );
}
