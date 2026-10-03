export default function Loading() {
  return (
    <main className="page-main container" role="status">
      <div className="loading-line" />
      <div className="loading-line loading-line--short" />
      <span className="sr-only">Loading lesson</span>
    </main>
  );
}
