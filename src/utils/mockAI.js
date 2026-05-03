export const getAiResponse = async (prompt, codeContext = '') => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('error')) {
    return {
      content: "I've analyzed your code for potential errors. \n\n```javascript\n// Suggestion: Check for null safety\nif (data && data.items) {\n  process(data.items);\n}\n```\n\nCommon fixes include:\n1. Verifying syntax (missing semi-colons or braces).\n2. Ensuring variable names are correctly spelled.",
      type: 'debugging',
      suggestedCode: "if (data && data.items) {\n  process(data.items);\n}"
    };
  }

  if (lowerPrompt.includes('optimize')) {
    return {
      content: "To optimize your current code, I recommend using a more performant approach: \n\n```javascript\nconst optimizedResult = useMemo(() => {\n  return data.reduce((acc, curr) => acc + curr.value, 0);\n}, [data]);\n```\n\nThis will prevent expensive recalculations on every render.",
      type: 'optimization',
      suggestedCode: "const optimizedResult = useMemo(() => {\n  return data.reduce((acc, curr) => acc + curr.value, 0);\n}, [data]);"
    };
  }

  if (lowerPrompt.includes('explain')) {
    const lines = codeContext.split('\n').length;
    return {
      content: `This file contains ${lines} lines of code. It appears to be a ${codeContext.includes('React') ? 'React component' : 'script'}. The primary logic handles data processing and state management. The code is well-structured but could benefit from more comments.`,
      type: 'explanation'
    };
  }

  return {
    content: "I've analyzed your request. Based on your current context in ZenExit IDE, I suggest checking your logic flow and ensuring all dependencies are correctly managed. Let me know if you want me to write some boilerplate for you!",
    type: 'general'
  };
};
