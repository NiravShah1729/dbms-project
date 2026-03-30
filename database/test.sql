UPDATE "User" SET CF_Handle = 'Nirav1729' WHERE Email = 'niravshah2236@gmail.com';
COMMIT;
SELECT UserID, FullName, Email, CF_Handle FROM "User" WHERE Email = 'niravshah2236@gmail.com';
EXIT;
