#!/usr/bin/env python3
"""
Fix n8n workflow JSON files for v1.120.4 compatibility:
- AI Agent node: typeVersion 3, keep options: {}
- All other nodes: remove options: {} if empty
"""

import json
import sys

def fix_workflow(filepath):
    """Fix n8n workflow structure"""

    # Read JSON
    with open(filepath, 'r', encoding='utf-8') as f:
        workflow = json.load(f)

    # Process each node
    for node in workflow.get('nodes', []):
        node_type = node.get('type', '')
        node_id = node.get('id', '')
        params = node.get('parameters', {})

        # AI Agent node - special handling
        if node_type == '@n8n/n8n-nodes-langchain.agent':
            print(f"  ✓ AI Agent node '{node.get('name')}': typeVersion 3, keeping options: {{}}")
            node['typeVersion'] = 3
            # Ensure options exists and is empty dict
            if 'options' not in params:
                params['options'] = {}

        # All other nodes - remove empty options
        else:
            if 'options' in params:
                # Only remove if it's an empty dict
                if params['options'] == {}:
                    del params['options']
                    print(f"  ✓ Removed empty options from '{node.get('name')}'")

    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(workflow, f, indent=2, ensure_ascii=False)

    print(f"✅ Fixed: {filepath}")
    return True

def main():
    files = [
        '/home/user/-landing-pages-amj-portfolio/chatbot-estetica-demo/workflows/v2-ai-agent/DEMO_Essenza_Prime_AI_Agent.json',
        '/home/user/-landing-pages-amj-portfolio/chatbot-estetica-demo/workflows/v2-ai-agent/STRIPE_WEBHOOK_WORKFLOW.json'
    ]

    for filepath in files:
        print(f"\n📝 Processing: {filepath}")
        try:
            fix_workflow(filepath)
        except Exception as e:
            print(f"❌ Error processing {filepath}: {e}")
            return 1

    return 0

if __name__ == '__main__':
    sys.exit(main())
