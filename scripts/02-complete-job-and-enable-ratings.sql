-- Function to complete a job and enable ratings
CREATE OR REPLACE FUNCTION complete_job(job_id UUID)
RETURNS void AS $$
BEGIN
  -- Update job status to completed
  UPDATE jobs 
  SET status = 'completed', updated_at = NOW()
  WHERE id = job_id;
  
  -- Mark all tasks as completed if not already
  UPDATE tasks 
  SET status = 'completed', completed_at = NOW(), updated_at = NOW()
  WHERE job_id = job_id AND status != 'completed';
END;
$$ LANGUAGE plpgsql;

-- Function to check if both parties have rated each other
CREATE OR REPLACE FUNCTION check_mutual_ratings(job_id UUID)
RETURNS TABLE(admin_rated boolean, freelancer_rated boolean) AS $$
DECLARE
  admin_id UUID;
  freelancer_id UUID;
  admin_review_exists boolean := false;
  freelancer_review_exists boolean := false;
BEGIN
  -- Get admin and freelancer IDs for this job
  SELECT j.admin_id, b.freelancer_id INTO admin_id, freelancer_id
  FROM jobs j
  JOIN bids b ON j.id = b.job_id
  WHERE j.id = job_id AND b.status = 'accepted';
  
  -- Check if admin has rated freelancer
  SELECT EXISTS(
    SELECT 1 FROM reviews 
    WHERE job_id = job_id 
    AND reviewer_id = admin_id 
    AND reviewee_id = freelancer_id
  ) INTO admin_review_exists;
  
  -- Check if freelancer has rated admin
  SELECT EXISTS(
    SELECT 1 FROM reviews 
    WHERE job_id = job_id 
    AND reviewer_id = freelancer_id 
    AND reviewee_id = admin_id
  ) INTO freelancer_review_exists;
  
  RETURN QUERY SELECT admin_review_exists, freelancer_review_exists;
END;
$$ LANGUAGE plpgsql;
