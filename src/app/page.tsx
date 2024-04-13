'use client'
import Editor from '@monaco-editor/react';

export default function Home() {
  return (
    <main className="flex h-screen w-screen">
      <div className="w-1/2">
      <Editor className="w-1/2" defaultLanguage='c'/>
      </div>
      
    </main>
  );
}
