# Technology Stack

# Technology Stack

The Timebars Ltd. products utilize the following technologies:

## Docker Deployment Architecture

The entire Timebars solution is containerized and deployed using **Docker**, with all images hosted on Docker Hub. This modern deployment approach simplifies installation, ensures consistency across environments, and enables rapid scaling. The complete solution requires just **5 Docker containers**:

- **jimecox807/tbrun** - Frontend client application (Timebars/Agilebars/Costbars)
- **jimecox807/tbwwwp** - Sales and support website with Cloud Dashboard
- **jimecox807/tbbe** - Strapi backend services
- **jimecox807/tbfm** - File management and CMS system
- **jimecox807/tbcdn** - CDN services for media delivery

All containers are orchestrated together to provide a complete, production-ready Timebars solution that can be deployed in minutes.

## Client Web Application - Agilebars-Timebars-Costbars

The client-side application runs in a web browser and relies on **HTML5**, **CSS**, **JavaScript**, and **IndexedDB** for local data storage. The codebase leverages **jQuery** and **jQuery UI** for enhanced interactivity and is stored in a cloud-based source control system as a private repository. 

The application builds using **Parcel.js** and is deployed as a Docker container (**jimecox807/tbrun**), making it easy to run consistently across different environments.

## Sales & Support Site and the Cloud Dashboard

This website relies on **Next.js v14.x**, which includes the **React** framework. Next.js, an open-source web development framework created by Vercel, enables React-based web applications with server-side rendering (SSR) and static site generation (SSG). The codebase, including open-source frameworks, is stored in a source control system as a private repository.

The application builds using **NPM** and is deployed as a Docker container (**jimecox807/tbwwwp**).

## Backend: Strapi

**Strapi** is a no-code, open-source headless CMS built on **Node.js**. It utilizes a **PostgreSQL** database and supports **REST API** and **GraphQL** operations for user registration, license purchasing, dashboard PubSets, and the sales site. 

The Strapi CMS codebase was sourced from an open-source repository, customized for specific needs, and is stored in a cloud source control system. The application builds using **NPM** and is deployed as a Docker container (**jimecox807/tbbe**).

## Timebars Ltd. CMS System

The CMS is a **Node.js** web server application for storing and downloading images. A separate **Next.js** site is configured to upload, download, and remove images from the CMS. The codebase is stored in a cloud source control system.

The application builds using **NPM** and is deployed as a single Docker container (**jimecox807/tbfm**).

## CDN Services

Media and static assets are delivered through a dedicated CDN container (**jimecox807/tbcdn**), ensuring fast and reliable content delivery to end users.

## Networking and DNS Management

Domains and networking services are managed through **Cloudflare**, providing robust DNS management, SSL/TLS encryption, and DDoS protection.

## Payment Processing

**Stripe** is used as the payment gateway, processing transactions via its proprietary REST API, ensuring secure and compliant payment handling.

## Email Processing

**Twilio SendGrid** is integrated with the sales site and Strapi CMS for scalable and reliable email delivery, supporting transactional emails, notifications, and customer communications.

## Developer's Stack

Development is performed using **Visual Studio Code (VS Code)** with extensions such as Live Server, Peacock, and Thunder Client. The stack includes **Node.js**, along with **NPM** and **Yarn** for package management. **Docker** and **Docker Compose** are used for local development and testing, mirroring the production deployment environment.

---