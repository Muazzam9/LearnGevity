import React, { useState } from 'react';

const StudentTable = ({ students, onEdit, onDelete, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');

  // Get all unique subjects from all students
  const allSubjects = [...new Set(
    students.flatMap(student => student.subjects_needed || [])
  )].sort();

  // Filter students based on search and subject filter
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parent_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.subjects_needed || []).some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSubject = !filterSubject || (student.subjects_needed || []).includes(filterSubject);
    
    return matchesSearch && matchesSubject;
  });

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-purple mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading students...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Search and Filter */}
      <div className="mb-6 grid md:grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            placeholder="Search by student name, parent name, email, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
          />
        </div>
        <div>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
          >
            <option value="">All Subjects</option>
            {allSubjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredStudents.length} of {students.length} student{students.length !== 1 ? 's' : ''}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parent/Guardian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subjects Needed
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    {searchTerm || filterSubject ? 'No students match your search' : 'No students yet'}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary-orange bg-opacity-20 flex items-center justify-center text-primary-orange font-semibold">
                            {student.name.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          {student.age && (
                            <div className="text-sm text-gray-500">Age {student.age}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.parent_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{student.parent_email}</div>
                      <div className="text-sm text-gray-500">{student.parent_phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(student.subjects_needed || []).slice(0, 2).map((subject, idx) => (
                          <span
                            key={idx}
                            className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary-orange bg-opacity-10 text-primary-orange"
                          >
                            {subject}
                          </span>
                        ))}
                        {(student.subjects_needed || []).length > 2 && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                            +{(student.subjects_needed || []).length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => onEdit(student)}
                        className="text-primary-purple hover:text-primary-navy mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(student)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentTable;

