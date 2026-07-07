package check

import (
	"os"
	"path/filepath"
	"strings"
)

type SourceInfo struct {
	Source string
	File   string
}

// BuildSourceMap walks website/docs/ and maps published paths to source files.
func BuildSourceMap(websiteRoot string) map[string]SourceInfo {
	out := make(map[string]SourceInfo)
	docsDir := filepath.Join(websiteRoot, "docs")
	_ = filepath.Walk(docsDir, func(path string, info os.FileInfo, err error) error {
		if err != nil || info.IsDir() {
			return nil
		}
		ext := strings.ToLower(filepath.Ext(path))
		if ext != ".md" && ext != ".mdx" {
			return nil
		}

		rel, err := filepath.Rel(docsDir, path)
		if err != nil {
			return nil
		}
		rel = filepath.ToSlash(rel)

		htmlPath := strings.TrimSuffix(rel, ext)
		htmlPath = strings.TrimSuffix(htmlPath, "/index")
		key := "docs/" + strings.Trim(htmlPath, "/")
		if key != "docs" {
			key += "/"
		}

		out[key] = SourceInfo{
			Source: "llm-d/llm-d",
			File:   "website/docs/" + rel,
		}
		return nil
	})

	community := []struct{ source, dest string }{
		{"website/community/contribute.md", "community/contribute"},
		{"website/community/code-of-conduct.md", "community/code-of-conduct"},
		{"website/community/security.md", "community/security"},
		{"website/community/sigs.md", "community/sigs"},
	}
	for _, c := range community {
		out[c.dest+".html"] = SourceInfo{Source: "llm-d/llm-d", File: c.source}
		out[c.dest+"/"] = SourceInfo{Source: "llm-d/llm-d", File: c.source}
	}

	return out
}

func lookupSource(pagePath string, sm map[string]SourceInfo) string {
	pagePath = strings.TrimPrefix(pagePath, "/")
	lookupPath := pagePath

	if info, ok := sm[lookupPath]; ok {
		return "**llm-d/llm-d**: `" + info.File + "`"
	}
	if !strings.HasSuffix(lookupPath, "/") {
		if info, ok := sm[strings.TrimSuffix(lookupPath, ".html")+"/"]; ok {
			return "**llm-d/llm-d**: `" + info.File + "`"
		}
	}
	if info, ok := sm[strings.TrimSuffix(lookupPath, ".html")]; ok {
		return "**llm-d/llm-d**: `" + info.File + "`"
	}
	if strings.HasPrefix(pagePath, "docs/") {
		return "**llm-d/llm-d** (website documentation)"
	}
	if strings.HasPrefix(pagePath, "community/") {
		return "**llm-d/llm-d** (website community page)"
	}
	return "**website/** (this repository)"
}
