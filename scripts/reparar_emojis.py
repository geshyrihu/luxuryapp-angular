import os
import sys

# Mapeo de emojis corruptos â  †â€™ emojis correctos
REPLACEMENTS = {
    'ðŸ"Œ': '🔌',
    'âœ…': '✅',
    'âŒ': '❌',
    'â³': '⏳',
    'ðŸ›‘': '🛑',
    'ðŸ¤': '🤝',
    'ðŸ‘‹': '👋',
    'ðŸŽ§': '🎧',
    'ðŸ“¨': '📨',
    'ðŸ”„': '🔄',
    'ðŸ“Š': '📊',
    'ðŸ“…': '📅',
    'ðŸ”Œ': '🔌',
    'âœ…': '✅',
    'âŒ': '❌',
    'â³': '⏳',
    'âš¡': '⚡',
    'ðŸš¨': '🚨',
    'ðŸŽ‰': '🎉',
    'ðŸ”¥': '🔥',
    'ðŸ’¡': '💡',
    'ðŸ““': '📓',
    'ðŸ“Œ': '📌',
    'ðŸ”’': '🔒',
    'ðŸ”“': '🔓',
    'ðŸ”‘': '🔑',
    'ðŸ”“': '🔔',
    'ðŸ“¢': '📢',
    'ðŸ“£': '📣',
    'ðŸ”Š': '🔊',
    'ðŸ”‰': '🔉',
    'ðŸ”ˆ': '🔈',
    'ðŸ”‡': '🔇',
    'ðŸ•°': '🕰',
    'âŒ›': '⌛',
    'âŒš': '⌚',
    'âž•': '➕',
    'âž–': '➖',
    'âž—': '➗',
    'âœ–': '✖',
    'âž¡': '➡',
    'â¬…': '⬅',
    'â¬†': '⬆',
    'â¬‡': '⬇',
    'ðŸ†˜': '🆘',
    'â—': '❗',
    'â•': '❕',
    'â“': '❓',
    'â”': '❔',
    'âœ”': '✔',
    'â˜': '☑',
    'ðŸ”´': '🔴',
    'ðŸŸ¢': '🟢',
    'ðŸ”µ': '🔵',
    'âš«': '⚫',
    'âšª': '⚪',
    'ðŸŸ¡': '🟡',
    'ðŸŸ ': '🟠',
    'ðŸŸ£': '🟣',
    'ðŸŸ¤': '🟤',
    'ðŸŸ¥': '🟥',
    'ðŸŸ¦': '🟦',
    'ðŸŸ§': '🟩',
    'ðŸŸ¨': '🟨',
    'ðŸŸ©': '🟩',
    'ðŸ‘†': '👆',
    'ðŸ‘‡': '👇',
    'ðŸ‘ˆ': '👈',
    'ðŸ‘‰': '👉',
    'ðŸ‘Š': '👊',
    'ðŸ•º': '🕺',
    'ðŸ’ª': '💪',
    'ðŸ‘': '👍',
    'ðŸ‘Ž': '👎',
    'ðŸ‘': '👏',
    'ðŸ™Œ': '🙌',
    'ðŸ™': '🙏',
    'ðŸ’': '💐',
    'ðŸŒ¹': '🌹',
    'ðŸ‘‘': '👑',
    'ðŸ”®': '🎮',
}

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        for bad, good in REPLACEMENTS.items():
            if bad in content:
                content = content.replace(bad, good)

        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"FIXED: {filepath}")
            return True
        return False
    except Exception as e:
        print(f"ERROR: {filepath} - {e}")
        return False

def scan_directory(directory):
    total_fixed = 0
    for root, dirs, files in os.walk(directory):
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', 'dist', '.angular']]

        for file in files:
            if file.endswith(('.ts', '.js', '.html', '.scss', '.css', '.md', '.json')):
                filepath = os.path.join(root, file)
                if fix_file(filepath):
                    total_fixed += 1

    print(f"\n=== Total archivos reparados: {total_fixed} ===")

if __name__ == "__main__":
    src_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'src')
    print(f"Escaneando: {src_path}\n")
    scan_directory(src_path)
