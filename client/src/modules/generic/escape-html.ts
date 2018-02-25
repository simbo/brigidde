export function escapeHtml(text: string): string {
  if (typeof text !== 'string') return text;
  var matchMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#039;'
  };
  return text.replace(/[&<>"']/g, (match) => matchMap[match]);
}
