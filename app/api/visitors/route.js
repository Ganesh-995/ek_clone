const visitorState = globalThis.__ekVisitorState ??= {
  total: 0,
  today: 0,
  live: 0,
};

export async function GET() {
  visitorState.live = Math.max(1, visitorState.live + 1);
  visitorState.total += 1;
  visitorState.today += 1;

  return Response.json({
    total: visitorState.total,
    today: visitorState.today,
    live: visitorState.live,
  });
}
