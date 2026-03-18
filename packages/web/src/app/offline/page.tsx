export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center">
        <span className="text-6xl block mb-4">🥬</span>
        <h1 className="text-2xl font-bold mb-2">오프라인 상태입니다</h1>
        <p className="text-muted-foreground">인터넷 연결을 확인해주세요.</p>
      </div>
    </div>
  );
}
