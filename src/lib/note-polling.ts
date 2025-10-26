/**
 * supabase のリアルタイム通信を使用しない場合の代替手段
 */
export const subscribe = (
  userId: string,
  callback: (payload: { eventType: string; new?: any; old?: any }) => void
) => {
  const interval = setInterval(async () => {
    const response = await fetch(`/api/notes/${userId}`);
    const notes = await response.json();
    callback({ eventType: 'UPDATE', new: notes });
  }, 600000); // 1分ごとにポーリング

  return interval;
};

export const unsubscribe = (interval: NodeJS.Timeout) => {
  clearInterval(interval);
};