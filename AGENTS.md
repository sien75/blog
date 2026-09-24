# AGENTS.md — blog

## 提交方式

提交与推送都经 `my-server`(`ssh my-server`),不在本机做。**严禁本机直接 push。**

完整流程:

```bash
# 1. 本机：把改动打成 patch（含新增文件）
git add -A
git diff --cached > /tmp/blog.patch
git reset

# 2. 找到服务器上的 repo（按仓库名搜索），把 patch 传过去
REPO=$(ssh my-server "find ~ -maxdepth 6 -type d -name blog 2>/dev/null | head -1")
scp /tmp/blog.patch my-server:/tmp/blog.patch

# 3. 服务器：应用 patch、commit、push
ssh my-server "cd $REPO && git apply /tmp/blog.patch && git add -A && git commit -m '<message>' && git push"

# 4. 本机：丢弃工作区改动并拉回
git checkout -- .
git clean -fd
git pull
```
