-- Create Database 'Group Project'

CREATE DATABASE [GroupProject]
GO


-- Select Database 'Group Project'

USE [GroupProject]
GO


-- Modules Table

CREATE TABLE [dbo].[Modules](
	[ModuleId] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Contents] [nvarchar](max) NOT NULL,
	[Overview] [nvarchar](800) NOT NULL,
	[Keywords] [nvarchar](256) NOT NULL,
	[Author] [nvarchar](256) NOT NULL,
	[ModuleStatusTypeId] [int] NOT NULL,
 CONSTRAINT [PK_Modules] PRIMARY KEY CLUSTERED 
(
	[ModuleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
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
SET IDENTITY_INSERT [dbo].[ModuleStatusTypes] ON 

INSERT [dbo].[ModuleStatusTypes] ([ModuleStatusTypeId], [Name]) VALUES (1, N'Draft')
INSERT [dbo].[ModuleStatusTypes] ([ModuleStatusTypeId], [Name]) VALUES (2, N'Published')

SET IDENTITY_INSERT [dbo].[ModuleStatusTypes] OFF
GO
ALTER TABLE [dbo].[Modules]  WITH CHECK ADD  CONSTRAINT [FK_Modules_ModuleStatusTypes] FOREIGN KEY([ModuleStatusTypeId])
REFERENCES [dbo].[ModuleStatusTypes] ([ModuleStatusTypeId])
GO
ALTER TABLE [dbo].[Modules] CHECK CONSTRAINT [FK_Modules_ModuleStatusTypes]