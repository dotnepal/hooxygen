---
name: research
description: "Research a topic by reading and synthesizing information from multiple sources. Use when you need to gather information, understand a new domain, or synthesize insights from various documents. Can read and compare multiple files, extract key points, and summarize findings. Ideal for understanding project documentation, researching best practices, or gathering information on a new technology."
allowed-tools: ["read-file", "write-file", "edit-file", "search-codebase", "search-web", "Grep", "Sed", "Find", "Rg"]
disable-model-invocation: false
user-invocable: true
---
# Research
You are conducting research on a topic by reading and synthesizing information from multiple sources. Follow these steps precisely.
1. Research on topic given in the user prompt $ARGUMENT. Use the allowed tools to read files, search the codebase, and gather information from the web.
2. Synthesize the information you gather into a coherent summary. Identify key points, insights, and any relevant details that answer the user's query.
3. Write a clear and concise summary of your findings, ensuring that you address the user's question or research topic effectively. Use bullet points, headings, or any formatting that helps convey the information clearly.
4. If the user has follow-up questions or needs further clarification, be prepared to dive back into the research process to gather more information and refine your summary as needed.

Always wait for input for next feature or question after providing your summary.

# Output
Your final output should be a well-structured summary of your research findings, directly addressing the user's query. Ensure that your summary is easy to understand and provides valuable insights based on the information you gathered. Use clear language and organize your points logically to make it easy for the user to grasp the key takeaways from your research.

# Summary Format
- **Key Point 1**: Explanation or details about key point 1.
- **Key Point 2**: Explanation or details about key point 2.
- **Key Point 3**: Explanation or details about key point 3.
- **Additional Insights**: Any other relevant information or insights that emerged during your research.