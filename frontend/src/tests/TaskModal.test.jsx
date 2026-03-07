import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskModal from '../components/TaskModal';

const mockSubmit = vi.fn();
const mockClose = vi.fn();

describe('TaskModal Component', () => {

  test('1. does not render when isOpen is false', () => {
    render(<TaskModal isOpen={false} onClose={mockClose} onSubmit={mockSubmit} task={null} />);
    expect(screen.queryByText(/new task/i)).not.toBeInTheDocument();
  });

  test('2. renders create form when isOpen and no task', () => {
    render(<TaskModal isOpen={true} onClose={mockClose} onSubmit={mockSubmit} task={null} />);
    expect(screen.getByText(/new task/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/task title/i)).toBeInTheDocument();
  });

  test('3. shows validation error when submitting without title', async () => {
    render(<TaskModal isOpen={true} onClose={mockClose} onSubmit={mockSubmit} task={null} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /create task/i }));
    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  test('4. calls onSubmit with data when form is valid', async () => {
    render(<TaskModal isOpen={true} onClose={mockClose} onSubmit={mockSubmit} task={null} />);
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText(/task title/i), 'My Test Task');
    await user.click(screen.getByRole('button', { name: /create task/i }));
    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'My Test Task' }),
      expect.anything()
    );
  });

  test('5. renders edit form and prefills data when task is provided', () => {
    const task = { id: 1, title: 'Existing Task', description: 'Desc', status: 'PENDING' };
    render(<TaskModal isOpen={true} onClose={mockClose} onSubmit={mockSubmit} task={task} />);
    expect(screen.getByText(/edit task/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing Task')).toBeInTheDocument();
  });
});