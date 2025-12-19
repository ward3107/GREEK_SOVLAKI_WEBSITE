@echo off
echo Updating HTML dimensions to 400x600...

powershell -Command "(Get-Content index.html) -replace 'width=\"800\" height=\"1732\"', 'width=\"400\" height=\"600\"' -replace 'width=\"800\" height=\"600\"', 'width=\"400\" height=\"600\"' | Set-Content index.html"

echo HTML dimensions updated!
pause