-- Create Database 'Group Project'

CREATE DATABASE [GroupProject]
GO


-- Select Database 'Group Project'

USE [GroupProject]
GO


-- Categories

CREATE TABLE [dbo].[Categories](
	[CategoryId] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
 CONSTRAINT [PK_Categories] PRIMARY KEY CLUSTERED 
(
	[CategoryId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


-- Keywords

CREATE TABLE [dbo].[Keywords](
	[KeywordId] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](max) NOT NULL,
	[CategoryId] [int] NOT NULL,
 CONSTRAINT [PK_Keywords] PRIMARY KEY CLUSTERED 
(
	[KeywordId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


-- Modules

CREATE TABLE [dbo].[Modules](
	[ModuleId] [int] IDENTITY(1,1) NOT NULL,
	[Contents] [nvarchar](max) NOT NULL,
	[PassChoiceText] [nvarchar](max) NULL,
	[PassChoiceResult] [nvarchar](max) NULL,
	[FailChoiceText] [nvarchar](max) NULL,
	[FailChoiceResult] [nvarchar](max) NULL,
	[Author] [nvarchar](256) NOT NULL,
	[ModuleStatusTypeId] [int] NOT NULL,
 CONSTRAINT [PK_Modules] PRIMARY KEY CLUSTERED 
(
	[ModuleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


-- Modules2Keywords

CREATE TABLE [dbo].[Modules2Keywords](
	[Module2KeywordId] [int] IDENTITY(1,1) NOT NULL,
	[ModuleId] [int] NOT NULL,
	[KeywordId] [int] NOT NULL,
 CONSTRAINT [PK_Modules2Keywords] PRIMARY KEY CLUSTERED 
(
	[Module2KeywordId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


-- ModuleStatusTypes

CREATE TABLE [dbo].[ModuleStatusTypes](
	[ModuleStatusTypeId] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_ModuleStatusTypes] PRIMARY KEY CLUSTERED 
(
	[ModuleStatusTypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Categories] ON 

SET IDENTITY_INSERT [dbo].[Categories] OFF
GO
SET IDENTITY_INSERT [dbo].[Keywords] ON 

SET IDENTITY_INSERT [dbo].[Keywords] OFF
GO
SET IDENTITY_INSERT [dbo].[Modules] ON 

SET IDENTITY_INSERT [dbo].[Modules] OFF
GO
SET IDENTITY_INSERT [dbo].[Modules2Keywords] ON 

SET IDENTITY_INSERT [dbo].[Modules2Keywords] OFF
GO
SET IDENTITY_INSERT [dbo].[ModuleStatusTypes] ON 

SET IDENTITY_INSERT [dbo].[ModuleStatusTypes] OFF
GO
ALTER TABLE [dbo].[Keywords]  WITH CHECK ADD  CONSTRAINT [FK_Keywords_Categories] FOREIGN KEY([CategoryId])
REFERENCES [dbo].[Categories] ([CategoryId])
GO
ALTER TABLE [dbo].[Keywords] CHECK CONSTRAINT [FK_Keywords_Categories]
GO
ALTER TABLE [dbo].[Modules]  WITH CHECK ADD  CONSTRAINT [FK_Modules_ModuleStatusTypes] FOREIGN KEY([ModuleStatusTypeId])
REFERENCES [dbo].[ModuleStatusTypes] ([ModuleStatusTypeId])
GO
ALTER TABLE [dbo].[Modules] CHECK CONSTRAINT [FK_Modules_ModuleStatusTypes]
GO
ALTER TABLE [dbo].[Modules2Keywords]  WITH CHECK ADD  CONSTRAINT [FK_Modules2Keywords_Keywords] FOREIGN KEY([KeywordId])
REFERENCES [dbo].[Keywords] ([KeywordId])
GO
ALTER TABLE [dbo].[Modules2Keywords] CHECK CONSTRAINT [FK_Modules2Keywords_Keywords]
GO
ALTER TABLE [dbo].[Modules2Keywords]  WITH CHECK ADD  CONSTRAINT [FK_Modules2Keywords_Modules] FOREIGN KEY([ModuleId])
REFERENCES [dbo].[Modules] ([ModuleId])
GO
ALTER TABLE [dbo].[Modules2Keywords] CHECK CONSTRAINT [FK_Modules2Keywords_Modules]
