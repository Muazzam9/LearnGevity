import React, { useState } from 'react';

const TutorTable = ({ tutors, onEdit, onDelete, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');

  const allSubjects = [...new Set(
    tutors.flatMap(tutor => tutor.subjects || [])
  )].sort();

  // Filter tutors based on search and subject filter
  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = 
      tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tutor.subjects || []).some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSubject = !filterSubject || (tutor.subjects || []).includes(filterSubject);
    
    return matchesSearch && matchesSubject;
  });

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-purple mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading tutors...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Search and Filter */}
      <div className="mb-6 grid md:grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            placeholder="Search by name, email, or subject..."
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
        Showing {filteredTutors.length} of {tutors.length} tutor{tutors.length !== 1 ? 's' : ''}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subjects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTutors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    {searchTerm || filterSubject ? 'No tutors match your search' : 'No tutors yet'}
                  </td>
                </tr>
              ) : (
                filteredTutors.map((tutor) => (
                  <tr key={tutor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {tutor.photo_url ? (
                            <img
                              src={tutor.photo_url}
                              alt={tutor.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-primary-purple bg-opacity-20 flex items-center justify-center text-primary-purple font-semibold">
                              {tutor.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{tutor.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{tutor.email}</div>
                      {tutor.phone && (
                        <div className="text-sm text-gray-500">{tutor.phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(tutor.subjects || []).slice(0, 2).map((subject, idx) => (
                          <span
                            key={idx}
                            className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary-purple bg-opacity-10 text-primary-purple"
                          >
                            {subject}
                          </span>
                        ))}
                        {(tutor.subjects || []).length > 2 && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                            +{(tutor.subjects || []).length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-primary-orange">
                        R{tutor.hourly_rate}/hr
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          tutor.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {tutor.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => onEdit(tutor)}
                        className="text-primary-purple hover:text-primary-navy mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(tutor)}
                        className="text-red-600 hover:text-red-900"
                      >
                        {tutor.is_active ? 'Deactivate' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
    </div>
  );
};

export default TutorTable;

