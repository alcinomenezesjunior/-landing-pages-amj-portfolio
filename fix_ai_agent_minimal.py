#!/usr/bin/env python3
"""
Remove ALL parameters from AI Agent except 'options: {}'
In n8n v1.120.4, AI Agent should have minimal parameters.
Model configuration goes in separate Anthropic Chat Model node.
"""

import json
import sys

def fix_ai_agent_minimal(filepath):
    """Reduce AI Agent to minimal parameters structure"""

    # Read JSON
    with open(filepath, 'r', encoding='utf-8') as f:
        workflow = json.load(f)

    # Find and fix AI Agent node
    for node in workflow.get('nodes', []):
        if node.get('type') == '@n8n/n8n-nodes-langchain.agent':
            print(f"  🔍 Found AI Agent: '{node.get('name')}'")
            print(f"     Current parameters: {list(node.get('parameters', {}).keys())}")

            # Replace ALL parameters with just options: {}
            node['parameters'] = {
                'options': {}
            }

            print(f"     ✅ Reduced to: {list(node.get('parameters', {}).keys())}")
            print(f"     (All model config should be in separate Anthropic Chat Model node)")

    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(workflow, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Fixed: {filepath}")
    return True

def main():
    filepath = '/home/user/-landing-pages-amj-portfolio/chatbot-estetica-demo/workflows/v2-ai-agent/DEMO_Essenza_Prime_AI_Agent.json'

    print(f"📝 Processing: {filepath}\n")
    try:
        fix_ai_agent_minimal(filepath)
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return 1

    return 0

if __name__ == '__main__':
    sys.exit(main())
