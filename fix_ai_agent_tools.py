#!/usr/bin/env python3
"""
Remove inline 'tools' parameter from AI Agent node.
In n8n, tools are connected as separate nodes, not defined inline.
"""

import json
import sys

def fix_ai_agent_node(filepath):
    """Remove tools array from AI Agent parameters"""

    # Read JSON
    with open(filepath, 'r', encoding='utf-8') as f:
        workflow = json.load(f)

    # Find and fix AI Agent node
    for node in workflow.get('nodes', []):
        if node.get('type') == '@n8n/n8n-nodes-langchain.agent':
            params = node.get('parameters', {})

            # Remove 'tools' if it exists
            if 'tools' in params:
                print(f"  ✓ Removing inline 'tools' array from '{node.get('name')}'")
                print(f"    (Tools should be connected as separate nodes, not inline)")
                del params['tools']

            # Verify structure
            print(f"\n  AI Agent parameters:")
            print(f"    - model: {params.get('model', 'NOT SET')}")
            print(f"    - typeVersion: {node.get('typeVersion')}")
            print(f"    - has options: {'options' in params}")
            print(f"    - has tools (inline): {'tools' in params}")

    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(workflow, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Fixed: {filepath}")
    return True

def main():
    filepath = '/home/user/-landing-pages-amj-portfolio/chatbot-estetica-demo/workflows/v2-ai-agent/DEMO_Essenza_Prime_AI_Agent.json'

    print(f"📝 Processing: {filepath}\n")
    try:
        fix_ai_agent_node(filepath)
    except Exception as e:
        print(f"❌ Error: {e}")
        return 1

    return 0

if __name__ == '__main__':
    sys.exit(main())
