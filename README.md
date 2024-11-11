# How To Run

<em>The steps below must be done when the project is open in Visual Studio 2022.</em>

## Build the Project

1. **Restore NuGet Packages - Do after initial setup / after pull request from repo**

   - In the **Solution Explorer**, right-click on the solution at the top and select **Restore NuGet Packages**.

2. **Restore Node Modules - Do after initial setup / after pull request from repo**

   - Inside `1. Web` project there is a `package.json` file.
   - Right-click on the file and select `Restore Packages`.

3. **Build the Solution**

   - In the **Solution Explorer**, right-click on the solution and select **Rebuild Solution**.
   - Visual Studio will compile the solution and check for any errors. Ensure the build completes successfully.

4. **Run the Project**

   - **Ctrl+F5** to run without debugging.
   - Only need to choose **Run** (or press `F5`) when debugging server code
   - The application should now launch in your default web browser.
   - After running you can enable hot reload by pressing the icon to the right of the play button. This allows to make changes to the UI that automatically show without having to rebuild the solution.