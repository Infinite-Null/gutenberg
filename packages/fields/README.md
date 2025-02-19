# Fields

This package provides core elements for the DataView library, designed to simplify the creation and management of data display elements in WordPress.

## Installation

Install the module

```bash
npm install @wordpress/fields --save
```

## Usage

<!-- START TOKEN(Autogenerated API docs) -->

### authorField

Author field for BasePost.

### BasePost

Undocumented declaration.

### BasePostWithEmbeddedAuthor

Undocumented declaration.

### commentStatusField

Comment status field for BasePost.

### CreateTemplatePartModal

A React component that renders a modal for creating a template part. The modal displays a title and the contents for creating the template part. This component should not live in this package, it should be moved to a dedicated package responsible for managing template.

_Parameters_

-   _props_ `Object`: The component props.
-   _props.modalTitle_ `{ modalTitle: string; } & CreateTemplatePartModalContentsProps[ 'modalTitle' ]`:

### dateField

Date field for BasePost.

### deletePost

Delete action for Templates, Patterns and Template Parts.

### duplicatePattern

Duplicate action for Pattern.

### duplicatePost

Duplicate action for BasePost.

### duplicateTemplatePart

Duplicate action for TemplatePart.

### exportPattern

Export action as JSON for Pattern.

### featuredImageField

Featured Image field for BasePost.

### orderField

Order field for BasePost.

### pageTitleField

Title for the page entity.

### parentField

Parent field for BasePost.

### passwordField

Password field for BasePost.

### patternTitleField

Title for the pattern entity.

### permanentlyDeletePost

Delete action for PostWithPermissions.

### PostType

Undocumented declaration.

### renamePost

Rename action for PostWithPermissions.

### reorderPage

Reorder action for BasePost.

### resetPost

Reset action for Template and TemplatePart.

### restorePost

Restore action for PostWithPermissions.

### slugField

Slug field for BasePost.

### statusField

Status field for BasePost.

### templateField

Template field for BasePost.

### templateTitleField

Title for the template entity.

### titleField

Title for the any entity with a `title` property. For patterns, pages or templates you should use the respective field because there are some differences in the rendering, labels, etc.

### trashPost

Trash action for PostWithPermissions.

### viewPost

View post action for BasePost.

### viewPostRevisions

View post revisions action for Post.

<!-- END TOKEN(Autogenerated API docs) -->

## Contributing to this package

This is an individual package that's part of the Gutenberg project. The project is organized as a monorepo. It's made up of multiple self-contained software packages, each with a specific purpose. The packages in this monorepo are published to [npm](https://www.npmjs.com/) and used by [WordPress](https://make.wordpress.org/core/) as well as other software projects.

To find out more about contributing to this package or Gutenberg as a whole, please read the project's main [contributor guide](https://github.com/WordPress/gutenberg/tree/HEAD/CONTRIBUTING.md).

<br /><br /><p align="center"><img src="https://s.w.org/style/images/codeispoetry.png?1" alt="Code is Poetry." /></p>
