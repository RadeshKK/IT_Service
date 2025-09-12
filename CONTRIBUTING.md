# Contributing to Smart IT Service Request & Issue Tracking System

Thank you for your interest in contributing to our project! We welcome contributions from the community and are grateful for your help in making this project better.

## 🤝 How to Contribute

### 1. Fork the Repository
- Click the "Fork" button on the top right of the repository page
- Clone your forked repository to your local machine

### 2. Set Up Development Environment
```bash
# Clone your fork
git clone https://github.com/yourusername/smart-it-tracker.git
cd smart-it-tracker

# Add upstream remote
git remote add upstream https://github.com/originalowner/smart-it-tracker.git

# Install dependencies
npm install
cd server && npm install
cd ../client && npm install
```

### 3. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### 4. Make Your Changes
- Write clean, readable code
- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed

### 5. Test Your Changes
```bash
# Run all tests
npm test

# Run specific test suites
cd server && npm test
cd client && npm test

# Test the application manually
npm run dev
```

### 6. Commit Your Changes
```bash
git add .
git commit -m "feat: add new feature description"
```

**Commit Message Format:**
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 7. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title and description
- Reference any related issues
- Include screenshots for UI changes
- List any breaking changes

## 📋 Development Guidelines

### Code Style
- Use **ESLint** configuration provided
- Follow **Prettier** formatting
- Use **conventional commits**
- Write **meaningful variable names**
- Add **JSDoc comments** for functions

### Frontend Guidelines
- Use **React Hooks** over class components
- Follow **component composition** patterns
- Use **TypeScript** for type safety (when applicable)
- Implement **responsive design**
- Follow **accessibility** best practices

### Backend Guidelines
- Use **async/await** over callbacks
- Implement **proper error handling**
- Add **input validation** with Joi
- Use **environment variables** for configuration
- Follow **RESTful API** conventions

### Database Guidelines
- Use **parameterized queries** to prevent SQL injection
- Add **proper indexes** for performance
- Use **transactions** for related operations
- Follow **naming conventions**

## 🐛 Reporting Issues

### Before Reporting
1. Check if the issue already exists
2. Try the latest version
3. Check the documentation
4. Search existing discussions

### Issue Template
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Node.js version: [e.g. 18.0.0]
- Database: [e.g. PostgreSQL 13]

**Additional context**
Add any other context about the problem here.
```

## 💡 Suggesting Features

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
A clear description of any alternative solutions.

**Additional context**
Add any other context or screenshots about the feature request.
```

## 🧪 Testing Guidelines

### Unit Tests
- Test individual functions and components
- Aim for high code coverage
- Use descriptive test names
- Test both success and error cases

### Integration Tests
- Test API endpoints
- Test database operations
- Test user workflows
- Test error scenarios

### Manual Testing
- Test on different browsers
- Test on different screen sizes
- Test with different user roles
- Test edge cases

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for functions
- Document complex algorithms
- Explain business logic
- Update README when needed

### API Documentation
- Document all endpoints
- Include request/response examples
- Document error codes
- Keep documentation up to date

## 🔒 Security

### Security Guidelines
- Never commit secrets or API keys
- Use environment variables for sensitive data
- Validate all user inputs
- Follow OWASP guidelines
- Report security issues privately

### Reporting Security Issues
If you discover a security vulnerability, please:
1. **DO NOT** create a public issue
2. Email us at security@yourcompany.com
3. Include detailed information about the vulnerability
4. Allow reasonable time for response before disclosure

## 🏷️ Release Process

### Version Numbering
We follow [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality
- **PATCH** version for backwards-compatible bug fixes

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Tagged release
- [ ] Deployed to staging
- [ ] Deployed to production

## 🎯 Areas for Contribution

### High Priority
- **Bug fixes** - Help us squash bugs
- **Documentation** - Improve our docs
- **Tests** - Increase test coverage
- **Performance** - Optimize slow areas

### Medium Priority
- **New features** - Add requested functionality
- **UI/UX improvements** - Enhance user experience
- **API enhancements** - Improve API design
- **Security** - Strengthen security measures

### Low Priority
- **Code refactoring** - Clean up code
- **Dependencies** - Update packages
- **Tooling** - Improve development tools
- **Examples** - Add usage examples

## 📞 Getting Help

### Community Support
- **GitHub Discussions** - Ask questions and share ideas
- **GitHub Issues** - Report bugs and request features
- **Discord/Slack** - Real-time chat (if available)

### Code Review Process
1. **Automated checks** must pass
2. **At least one reviewer** approval required
3. **All conversations** must be resolved
4. **Tests** must pass
5. **Documentation** must be updated

## 🙏 Recognition

Contributors will be recognized in:
- **CONTRIBUTORS.md** file
- **Release notes**
- **Project README**
- **GitHub contributors** page

## 📄 License

By contributing, you agree that your contributions will be licensed under the same MIT License that covers the project.

---

**Thank you for contributing! 🎉**

*Together, we can build amazing software that helps IT teams work more efficiently.*
