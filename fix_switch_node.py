#!/usr/bin/env python3
"""
Fix Switch node typeVersion to avoid "Could not find property option" error.
This is a known bug in n8n with Switch node v2.
"""

import json
import sys

def fix_switch_node(filepath):
    """Change Switch node from typeVersion 2 to typeVersion 3"""

    # Read JSON
    with open(filepath, 'r', encoding='utf-8') as f:
        workflow = json.load(f)

    # Find and fix Switch nodes
    for node in workflow.get('nodes', []):
        if node.get('type') == 'n8n-nodes-base.switch':
            old_version = node.get('typeVersion')

            if old_version == 2:
                print(f"  🔧 Found Switch node: '{node.get('name')}'")
                print(f"     Current typeVersion: {old_version}")

                # Change to typeVersion 3
                node['typeVersion'] = 3

                print(f"     ✅ Changed to typeVersion: 3")
                print(f"     (This fixes the 'Could not find property option' import error)")
                print()

    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(workflow, f, indent=2, ensure_ascii=False)

    print(f"✅ Fixed: {filepath}")
    return True

def main():
    filepath = '/home/user/-landing-pages-amj-portfolio/chatbot-estetica-demo/workflows/v2-ai-agent/DEMO_Essenza_Prime_AI_Agent.json'

    print(f"📝 Fixing Switch node typeVersion...\n")
    try:
        fix_switch_node(filepath)
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return 1

    return 0

if __name__ == '__main__':
    sys.exit(main())
