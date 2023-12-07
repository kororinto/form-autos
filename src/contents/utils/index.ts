
function findFirstNonEmptyText(element) {
  if (element.childNodes.length === 0) {
    return null;
  }
  for (let i = 0; i < element.childNodes.length; i++) {
    let child = element.childNodes[i];
    if (child.nodeType === 3 && child.textContent.trim() !== '') {
      return child;
    } else if (child.nodeType === 1) {
      let text = findFirstNonEmptyText(child);
      if (text) {
        return text;
      }
    }
  }
  return null;
}
export function getClosestText(element) {
  let siblings: string;
  let prevSibling = element.previousSibling;
  let nextSibling = element.nextSibling;

  while (prevSibling || nextSibling) {
    if (prevSibling && prevSibling.nodeType === 3 && prevSibling.textContent.trim() !== '') {
      siblings = prevSibling.textContent;
    } else if (prevSibling && prevSibling.nodeType === 1) {
      let text = findFirstNonEmptyText(prevSibling);
      if (text) {
        siblings = text.textContent;
      }
    }
    if (nextSibling && nextSibling.nodeType === 3 && nextSibling.textContent.trim() !== '') {
      siblings = nextSibling.textContent
    } else if (nextSibling && nextSibling.nodeType === 1) {
      let text = findFirstNonEmptyText(nextSibling);
      if (text) {
        siblings = text.textContent
      }
    }
    prevSibling = prevSibling ? prevSibling.previousSibling : null;
    nextSibling = nextSibling ? nextSibling.nextSibling : null;
  }

  if (!siblings) {
    let parent = element.parentNode;
    while (parent) {
      let parentSibling = parent.previousSibling;
      while (parentSibling) {
        if (parentSibling.nodeType === 3 && parentSibling.textContent.trim() !== '') {
          siblings = parentSibling.textContent
          return siblings;
        } else if (parentSibling.nodeType === 1) {
          let text = findFirstNonEmptyText(parentSibling);
          if (text) {
            siblings = text.textContent
            return siblings;
          }
        }
        parentSibling = parentSibling.previousSibling;
      }
      parent = parent.parentNode;
    }
  }

  return siblings;
}
