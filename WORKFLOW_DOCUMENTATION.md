# Kotak SA Onboarding - Technical Workflow Documentation

This document explains the architecture and implementation logic for the customized Camunda-React integration, specifically focusing on the premium banking UI and the custom document capture system.

---

## 1. Hybrid Form Architecture
The application uses a **Hybrid Rendering** strategy to handle Camunda forms. It dynamically switches between auto-generated forms and high-fidelity custom components.

### Form Switching Logic
**Location:** `App.jsx` -> `isCaptureDocumentForm()`
*   **How it works:** When a new task is fetched, the app inspects the JSON schema provided by Camunda. 
*   **The Trigger:** It scans for a component with `"path": "captureDocument"`.
*   **Result:** 
    *   **True:** Renders `CaptureDocumentForm.jsx` (Custom React Component).
    *   **False:** Renders `DynamicForm.jsx` (Powered by `@bpmn-io/form-js`).

---

## 2. Document Capture System (Custom UI)
When the workflow reaches the "Capture Document" stage, a specialized React component takes over to provide a native-app-like experience.

### Live Webcam Integration
**Location:** `CaptureDocumentForm.jsx`
*   **Camera Feed:** Uses `navigator.mediaDevices.getUserMedia` to stream the webcam directly into a `<video>` element.
*   **Hardware Control:** Specifically uses `facingMode: 'environment'` to prioritize the rear camera on mobile devices for clearer document snapshots.
*   **Snapshot Logic:** When the user clicks "Capture", the current video frame is drawn onto a hidden `<canvas>` and converted into a `Base64` image string.

### Data Binding
*   **Dynamic Variables:** The "CRN" and "Account Number" displayed at the top of the form are pulled dynamically from the `processVariables` object provided by the Camunda process engine.
*   **Validation:** The "Proceed" button remains locked until the required snapshots (MITC and Signature Card) are successfully captured.

---

## 3. Premium UI & Aesthetic Engineering
To meet banking-grade standards, the default library styles were heavily modified or suppressed.

### CSS Override Strategy
**Location:** `DynamicForm.css`
*   **Layout Fixes:** Specifically overrides `bpmn-io` defaults to force radio buttons and checkboxes into clean, responsive rows/columns that don't collapse into messy vertical lists on smaller screens.
*   **Shadow & Border Stripping:** Automatically removes the default black borders and shadows from `.fjs-input-group` wrappers to maintain a clean, flat design.
*   **Custom Inputs:** Standard checkboxes and radios were replaced with custom CSS pseudo-elements (`::after`) to achieve the signature Kotak blue-and-white checkmark style.

---

## 4. Task Completion Flow
**Location:** `App.jsx` -> `handleFormSubmit`
1.  User clicks **Proceed** on the custom form.
2.  The data is packaged into a structured JSON object (e.g., `{ "captureDocument": { ...images } }`).
3.  The `completeTask` API is called with the current `userTaskKey` and the updated payload.
4.  Camunda moves the process to the next state, and the app automatically fetches the next task's schema.

---

## 5. File Map Summary

| File | Purpose | Key Functionality |
| :--- | :--- | :--- |
| `App.jsx` | Main Controller | Form switching, API orchestration, and state management. |
| `CaptureDocumentForm.jsx` | Custom Feature | Webcam feed, image capturing, and local validation. |
| `CaptureDocumentForm.css` | Feature Styling | Camera modal UI, live feed guide, and capture slot design. |
| `DynamicForm.css` | Global Styling | Banking-grade theme, responsive fixes, and input overrides. |
| `services/api.js` | API Layer | Axios-based communication with the Camunda backend. |

---

*This documentation is intended for developers maintaining the Kotak SA Onboarding journey.*
