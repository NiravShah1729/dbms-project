-- ============================================================
-- Additional Database Programming Logic (Functions & Demo Triggers)
-- ============================================================

-- 1. FUNCTION: Get Solve Count for a specific user
CREATE OR REPLACE FUNCTION fn_get_solve_ratio(p_userid IN NUMBER) 
RETURN NUMBER AS
    v_total_subs NUMBER;
    v_total_solved NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_total_subs FROM Submission WHERE UserID = p_userid;
    SELECT TotalSolved INTO v_total_solved FROM UserStats WHERE UserID = p_userid;
    
    IF v_total_subs = 0 THEN
        RETURN 0;
    ELSE
        RETURN ROUND((v_total_solved / v_total_subs) * 100, 2);
    END IF;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN 0;
END;
/

-- 2. TRIGGER: Prevent deletion of questions that have submissions (Error Demo)
CREATE OR REPLACE TRIGGER trg_prevent_question_deletion
BEFORE DELETE ON Question
FOR EACH ROW
DECLARE
    v_count NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_count FROM Submission WHERE QuestionID = :OLD.QuestionID;
    
    IF v_count > 0 THEN
        RAISE_APPLICATION_ERROR(-20001, 'CRITICAL: Cannot delete question because it already has ' || v_count || ' student submissions.');
    END IF;
END;
/

-- 3. PROCEDURE: Sync User Statistics (Maintenance Fix)

CREATE OR REPLACE PROCEDURE sp_sync_user_stats(p_userid IN NUMBER) AS
    v_solve_count NUMBER;
BEGIN
    SELECT COUNT(DISTINCT QuestionID) INTO v_solve_count 
    FROM Submission s
    JOIN VerdictLookup v ON s.VerdictID = v.VerdictID
    WHERE UserID = p_userid AND v.Name = 'AC';

    UPDATE UserStats 
    SET TotalSolved = v_solve_count, UpdatedAt = SYSTIMESTAMP 
    WHERE UserID = p_userid;
    
    COMMIT;
END;
/
