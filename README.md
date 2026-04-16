# BudgetBites: A Budget-First Meal Planning Interface

BudgetBites is a prototype application designed to help users plan meals and generate grocery lists based on their budget, dietary restrictions, and cooking time. Built with Expo and React Native, this app aims to reduce meal-planning time, cognitive effort, and decision fatigue.

---

## Features

- **Budget Input**: Set a weekly budget to filter meal options.
- **Dietary Filters**: Apply dietary restrictions such as gluten-free, vegan, or halal.
- **Time Constraints**: Limit meal suggestions based on cooking time.
- **Meal Suggestions**: Browse meals tailored to your preferences.
- **Grocery List Generation**: Automatically generate a grocery list for selected meals.

---

## Get Started

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Start the App**:

   ```bash
   npx expo start
   ```

   In the output, you'll find options to open the app in a:
   - [Development Build](https://docs.expo.dev/develop/development-builds/introduction/)
   - [Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
   - [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/)
   - [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo.

3. **Reset the Project** (Optional):
   If you want to start fresh, run:
   ```bash
   npm run reset-project
   ```
   This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

---

## Code Structure

The BudgetBites project is organized as follows:

- **app/**: Contains the main screens and components of the app.
- **components/**: Reusable UI components such as meal cards, checkboxes, and charts.
- **context/**: Global state management using React Context.
- **data/**: Static data files such as `meals.json`.
- **hooks/**: Custom hooks for reusable logic.
- **constants/**: Theming and configuration constants.
- **scripts/**: Utility scripts for project management.
- **types/**: TypeScript type definitions.

This modular architecture ensures clarity, maintainability, and scalability.

---

## Documentation

### Inline Comments

The codebase includes detailed inline comments to explain the purpose and functionality of key components, methods, and logic. These comments follow standard conventions and are placed strategically to clarify complex sections of the code.

### README

This `README.md` file provides an overview of the project, including its purpose, setup instructions, and usage guidelines. It also includes troubleshooting tips and links to relevant resources.

---

## Prototype Status

The BudgetBites prototype is fully functional and has been rigorously tested to ensure reliability and usability. All core features have been implemented and verified against the project requirements. The system has undergone thorough testing, including both manual and user-based evaluations, to ensure it performs as expected under various scenarios.

While the current version is stable and ready for demonstration, future iterations may include additional features, optimizations, and refinements based on user feedback and further testing.

---

## Learn More

To learn more about developing your project with Expo, look at the following resources:

- [Expo Documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo Tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

---

## Join the Community

Join our community of developers creating universal apps:

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord Community](https://chat.expo.dev): Chat with Expo users and ask questions.
